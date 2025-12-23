import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { UserRepository } from "@/repositories/user.repo";
import { apiHandler } from "@/lib/api-handler";
import { authMiddleware } from "@/middleware/auth.middleware";
import { z } from "zod";

const createGuestUserSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    telefono: z.string().optional(),
});

/**
 * GET /api/veterinario/guest-users
 * Lists all guest users created by the veterinarian
 */
export const GET = apiHandler(async (req: Request) => {
    // Verify user is a veterinarian
    const user = await authMiddleware(req);
    if (!user || user.role !== "veterinario") {
        return NextResponse.json(
            { error: "No autorizado" },
            { status: 403 }
        );
    }

    // Find all users created by this veterinarian
    const users = await UserRepository.list({
        role: "cliente",
        search: null,
    });

    // Filter to only show guest users created by this vet
    const guestUsers = users.filter((u: any) =>
        u.createdBy && u.createdBy.toString() === user.id
    );

    return NextResponse.json(guestUsers, { status: 200 });
});

/**
 * POST /api/veterinario/guest-users
 * Creates a guest user account (veterinarian only)
 */
export const POST = apiHandler(async (req: Request) => {
    // Verify user is a veterinarian
    const user = await authMiddleware(req);
    if (!user || user.role !== "veterinario") {
        return NextResponse.json(
            { error: "No autorizado. Solo veterinarios pueden crear usuarios invitados." },
            { status: 403 }
        );
    }

    const body = await req.json();
    const data = createGuestUserSchema.parse(body);

    const guestUser = await AuthService.createGuestUser(data, user.id);

    return NextResponse.json(
        {
            message: "Usuario invitado creado exitosamente. Se ha enviado un email de activación.",
            user: guestUser,
        },
        { status: 201 }
    );
});
