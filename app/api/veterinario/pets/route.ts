import { NextResponse } from "next/server";
import { PetRepository } from "@/repositories/pet.repo";
import { apiHandler } from "@/lib/api-handler";
import { authMiddleware } from "@/middleware/auth.middleware";
import { z } from "zod";

const createPetSchema = z.object({
    ownerId: z.string().min(1, "ID del propietario requerido"),
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    especie: z.string().min(2, "La especie es requerida"),
    raza: z.string().min(2, "La raza es requerida"),
    peso: z.number().positive().optional(),
    sexo: z.enum(["macho", "hembra"]).optional(),
    fechaNacimiento: z.string().optional(),
    color: z.string().optional(),
    alergias: z.array(z.string()).optional(),
    esterilizado: z.boolean().optional(),
    microchip: z.string().optional(),
    notasEspeciales: z.string().optional(),
});

/**
 * POST /api/veterinario/pets
 * Creates a pet for a client (veterinarian only)
 */
export const POST = apiHandler(async (req: Request) => {
    // Verify user is a veterinarian
    const user = await authMiddleware(req);
    if (!user || user.role !== "veterinario") {
        return NextResponse.json(
            { error: "No autorizado. Solo veterinarios pueden crear mascotas para clientes." },
            { status: 403 }
        );
    }

    const body = await req.json();
    const data = createPetSchema.parse(body);

    // Create pet with veterinarian assigned
    const pet = await PetRepository.create({
        nombre: data.nombre,
        especie: data.especie,
        raza: data.raza,
        propietario: data.ownerId as any,
        assignedVet: user.id as any,
        peso: data.peso,
        sexo: data.sexo,
        fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
        color: data.color,
        alergias: data.alergias,
        esterilizado: data.esterilizado,
        microchip: data.microchip,
        notasEspeciales: data.notasEspeciales,
    });

    return NextResponse.json(
        {
            message: "Mascota creada exitosamente",
            pet,
        },
        { status: 201 }
    );
});
