import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { apiHandler } from "@/lib/api-handler";
import { z } from "zod";

const verifyTokenSchema = z.object({
    token: z.string().min(1, "Token requerido"),
});

/**
 * POST /api/auth/verify-reset-token
 * Verify if reset token is valid
 */
export const POST = apiHandler(async (req: Request) => {
    const body = await req.json();
    const data = verifyTokenSchema.parse(body);

    const result = await AuthService.verifyResetToken(data.token);

    return NextResponse.json(
        {
            valid: result.valid,
            email: result.email,
        },
        { status: 200 }
    );
});
