import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/user.repo";
import { signToken } from "@/lib/jwt";
import { IUser } from "@/models/User";
import { AppError } from "@/lib/api-handler";
import { EmailService } from "./email.service";

export const AuthService = {
  register: async (data: Partial<IUser>) => {
    if (!data.password) throw new AppError("Password is required", 400);

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await UserRepository.create({ ...data, password: hashed });

    // 🔥 Remover password de la respuesta
    const userObj = user.toObject();
    const { password, ...safeUser } = userObj;

    return safeUser;
  },

  login: async (email: string, password: string) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError("Usuario no encontrado", 404);

    // Check if user is a guest that hasn't been activated
    if (user.isGuest && !user.activatedAt) {
      throw new AppError(
        "Esta cuenta aún no ha sido activada. Por favor revisa tu correo electrónico.",
        401
      );
    }

    // Explicitly check password existence (though it should exist)
    if (!user.password) throw new AppError("Credenciales inválidas", 401);

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new AppError("Credenciales incorrectas", 401);

    const token = signToken({ id: (user._id as any).toString(), role: user.role });

    const userObj = user.toObject();
    const { password: _, ...safeUser } = userObj;

    return { user: safeUser, token };
  },

  /**
   * Creates a guest user account (called by veterinarian)
   */
  createGuestUser: async (
    data: { name: string; email: string; telefono?: string },
    veterinarianId: string
  ) => {
    // Check if user already exists
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError("Ya existe un usuario con este email", 400);
    }

    // Generate activation token
    const activationToken = EmailService.generateToken();
    const activationExpires = new Date();
    activationExpires.setDate(activationExpires.getDate() + 7); // 7 days

    // Create guest user without password
    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      telefono: data.telefono,
      role: "cliente",
      isGuest: true,
      activationToken,
      activationExpires,
      createdBy: veterinarianId as any,
    });

    // Send activation email
    try {
      await EmailService.sendActivationEmail(
        data.email,
        data.name,
        activationToken
      );
    } catch (error) {
      console.error("Error sending activation email:", error);
      // Don't fail the user creation if email fails
    }

    const userObj = user.toObject();
    const { password, activationToken: _, ...safeUser } = userObj;

    return safeUser;
  },

  /**
   * Activates a guest user account
   */
  activateGuestUser: async (token: string, password: string) => {
    const user = await UserRepository.findOne({
      activationToken: token,
      isGuest: true,
    });

    if (!user) {
      throw new AppError("Token de activación inválido", 400);
    }

    // Check if token is expired
    if (user.activationExpires && user.activationExpires < new Date()) {
      throw new AppError("El token de activación ha expirado", 400);
    }

    // Check if already activated
    if (user.activatedAt) {
      throw new AppError("Esta cuenta ya ha sido activada", 400);
    }

    // Hash password and activate account
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await UserRepository.update((user._id as any).toString(), {
      password: hashedPassword,
      isGuest: false,
      activatedAt: new Date(),
      activationToken: undefined,
      activationExpires: undefined,
    });

    if (!updatedUser) {
      throw new AppError("Error al activar la cuenta", 500);
    }

    // Generate token for automatic login
    const authToken = signToken({
      id: (updatedUser._id as any).toString(),
      role: updatedUser.role,
    });

    const userObj = updatedUser.toObject();
    const { password: _, ...safeUser } = userObj;

    return { user: safeUser, token: authToken };
  },

  /**
   * Request password reset - sends email with reset token
   */
  requestPasswordReset: async (email: string) => {
    const user = await UserRepository.findByEmail(email);

    // Don't reveal if user exists for security
    if (!user) {
      return { message: "Si el email existe, recibirás un enlace de recuperación" };
    }

    // Generate reset token
    const resetToken = EmailService.generateToken();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 24); // 24 hours

    // Update user with reset token
    await UserRepository.update((user._id as any).toString(), {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    // Send reset email
    try {
      await EmailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      // Don't fail the request if email fails
    }

    return { message: "Si el email existe, recibirás un enlace de recuperación" };
  },

  /**
   * Verify reset token validity
   */
  verifyResetToken: async (token: string) => {
    const user = await UserRepository.findOne({
      resetPasswordToken: token,
    });

    if (!user) {
      throw new AppError("Token de recuperación inválido", 400);
    }

    // Check if token is expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new AppError("El token de recuperación ha expirado", 400);
    }

    return { valid: true, email: user.email };
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string) => {
    const user = await UserRepository.findOne({
      resetPasswordToken: token,
    });

    if (!user) {
      throw new AppError("Token de recuperación inválido", 400);
    }

    // Check if token is expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new AppError("El token de recuperación ha expirado", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset fields
    const updatedUser = await UserRepository.update((user._id as any).toString(), {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    if (!updatedUser) {
      throw new AppError("Error al restablecer la contraseña", 500);
    }

    // Generate token for automatic login
    const authToken = signToken({
      id: (updatedUser._id as any).toString(),
      role: updatedUser.role,
    });

    const userObj = updatedUser.toObject();
    const { password: _, ...safeUser } = userObj;

    return { user: safeUser, token: authToken };
  },
};

