import { PetController } from "@/controllers/pet.controller";

// GET /api/pets
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const myPets = searchParams.get("my_pets");
    const userId = searchParams.get("userId");

    if (id) return PetController.getOne(req);
    if (myPets === "true") return PetController.listMyPets(req);
    if (userId) return PetController.listByOwner(req);

    return PetController.listAll(req);
}

export const POST = PetController.create;
export const PUT = PetController.update;
export const DELETE = PetController.delete;
