import { apiHandler, AppError } from "@/lib/api-handler";
import { UserService } from "@/services/user.service";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
});

export const POST = apiHandler(async (req: Request) => {
    const { cookies } = await import("next/headers");
    const { verifyToken } = await import("@/lib/jwt");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new AppError("Unauthorized", 401);
    const decoded = verifyToken(token);

    const body = await req.json();
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    // Get user with password
    const user = await UserService.findByIdWithPassword(decoded.id);
    if (!user) throw new AppError("Usuario no encontrado", 404);

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password || "");
    if (!isValidPassword) {
        throw new AppError("Contraseña actual incorrecta", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await UserService.updatePassword(decoded.id, hashedPassword);

    return NextResponse.json({ message: "Contraseña actualizada exitosamente" });
});
