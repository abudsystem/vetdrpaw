import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { apiHandler } from "@/lib/api-handler";
import { z } from "zod";

const requestResetSchema = z.object({
    email: z.string().email("Email inválido"),
});

/**
 * POST /api/auth/request-reset
 * Request password reset - sends email with reset token
 */
export const POST = apiHandler(async (req: Request) => {
    const body = await req.json();
    const data = requestResetSchema.parse(body);

    const result = await AuthService.requestPasswordReset(data.email);

    return NextResponse.json(
        {
            message: result.message,
        },
        { status: 200 }
    );
});
