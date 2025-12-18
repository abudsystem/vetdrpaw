import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/user.repo";
import { signToken } from "@/lib/jwt";
import { IUser } from "@/models/User";
import { AppError } from "@/lib/api-handler";

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

    // Explicitly check password existence (though it should exist)
    if (!user.password) throw new AppError("Credenciales inválidas", 401);

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new AppError("Credenciales incorrectas", 401);

    const token = signToken({ id: (user._id as any).toString(), role: user.role });

    const userObj = user.toObject();
    const { password: _, ...safeUser } = userObj;

    return { user: safeUser, token };
  },
};
