import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { apiHandler } from "@/lib/api-handler";
import { z } from "zod";

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token requerido"),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
        ),
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
export const POST = apiHandler(async (req: Request) => {
    const body = await req.json();
    const data = resetPasswordSchema.parse(body);

    const result = await AuthService.resetPassword(data.token, data.password);

    return NextResponse.json(
        {
            message: "Contraseña restablecida exitosamente",
            user: result.user,
            token: result.token,
        },
        { status: 200 }
    );
});
