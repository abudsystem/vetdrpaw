import { PetService } from "@/services/pet.service";
import { NextResponse } from "next/server";
import { apiHandler, AppError } from "@/lib/api-handler";
import { z } from "zod";

const createPetSchema = z.object({
  nombre: z.string().min(1),
  especie: z.string().min(1),
  edad: z.number().min(0),
  raza: z.string().min(1),
  assignedVet: z.string().optional().nullable(),
});

export const PetController = {
  create: apiHandler(async (req: Request) => {
    const body = await req.json();

    // Intentar obtener usuario del token si no viene en el body
    if (!body.propietario) {
      const { cookies } = await import("next/headers");
      const { verifyToken } = await import("@/lib/jwt");

      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      if (token) {
        try {
          const decoded = verifyToken(token);
          body.propietario = decoded.id;
        } catch (e) {
          // Token invalido, ignorar y dejar que falle validación si es requerido
        }
      }
    }

    const data = createPetSchema.parse(body);

    if (!body.propietario) throw new AppError("Propietario is required", 400);

    const pet = await PetService.create({ ...data, propietario: body.propietario } as any);
    return NextResponse.json(pet, { status: 201 });
  }),

  listByOwner: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) throw new AppError("User ID is required", 400);

    const pets = await PetService.listByOwner(userId);
    return NextResponse.json(pets);
  }),

  listAll: apiHandler(async () => {
    const pets = await PetService.listAll();
    console.log("Controller listAll pets:", pets);
    return NextResponse.json(pets);
  }),

  getOne: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new AppError("ID is required", 400);

    const pet = await PetService.getOne(id);
    if (!pet) throw new AppError("Pet not found", 404);
    console.log("Pet found:", pet);
    return NextResponse.json(pet);
  }),

  update: apiHandler(async (req: Request) => {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) throw new AppError("ID is required", 400);

    // Validate body partially? Or just pass to service
    // For now, assuming body is partial update

    const updatedPet = await PetService.update(id, body);
    if (!updatedPet) throw new AppError("Pet not found", 404);

    return NextResponse.json(updatedPet);
  }),

  delete: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) throw new AppError("ID is required", 400);

    const deletedPet = await PetService.delete(id);
    if (!deletedPet) throw new AppError("Pet not found", 404);

    return NextResponse.json(deletedPet);
  }),
};
