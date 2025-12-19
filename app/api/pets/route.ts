import { PetController } from "@/controllers/pet.controller";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Pet } from "@/models/Pet";
import { authMiddleware } from "@/middleware/auth.middleware";

// GET /api/pets
// Supports ?my_pets=true to filter by logged in user
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const myPets = searchParams.get("my_pets");

    if (id) {
        return PetController.getOne(req);
    }

    if (myPets === "true") {
        // Custom logic for "my pets" using auth middleware
        await connectDB();
        const user = await authMiddleware(req);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const pets = await Pet.find({ propietario: user.id }).populate("propietario assignedVet");
        return NextResponse.json(pets);
    }

    // If no my_pets and no userId, assume list all (for vets/administrador)
    // const { searchParams } = new URL(req.url); // Already declared above
    if (!searchParams.get("userId")) {
        // Check if user is vet or administrador
        await connectDB();
        const user = await authMiddleware(req);
        if (user && (user.role === "veterinario" || user.role === "administrador")) {
            return PetController.listAll(req);
        }
        // If not vet/administrador, fall through to listByOwner which will throw "User ID required"
    }

    return PetController.listByOwner(req);
}

export const POST = PetController.create;
export const PUT = PetController.update;
export const DELETE = PetController.delete;
