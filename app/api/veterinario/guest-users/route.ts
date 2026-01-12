import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { UserRepository } from "@/repositories/user.repo";
import { apiHandler, AppError } from "@/lib/api-handler";
import { z } from "zod";

const createGuestUserSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    telefono: z.string().optional(),
});

export const GET = apiHandler(async (req, { user }) => {
    // Find all users created by this veterinarian
    const users = await UserRepository.list({
        role: "cliente",
        search: null,
    });

    // Filter to only show guest users created by this vet
    const guestUsers = users.filter((u: any) =>
        u.createdBy && u.createdBy.toString() === user!.id
    );

    return NextResponse.json(guestUsers);
}, { requiredRoles: ["veterinario"] });

export const POST = apiHandler(async (req: Request, { user }) => {
    const body = await req.json();
    const data = createGuestUserSchema.parse(body);

    const guestUser = await AuthService.createGuestUser(data, user!.id);

    return NextResponse.json({
        message: "Usuario invitado creado exitosamente. Se ha enviado un email de activación.",
        user: guestUser,
    }, { status: 201 });
}, { requiredRoles: ["veterinario"] });
