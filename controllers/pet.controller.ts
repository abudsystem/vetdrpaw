import { PetService } from "@/services/pet.service";
import { NextResponse } from "next/server";
import { apiHandler, AppError } from "@/lib/api-handler";
import { z } from "zod";

const createPetSchema = z.object({
  nombre: z.string().min(1),
  especie: z.string().min(1),
  edad: z.number().min(0).optional(),
  raza: z.string().min(1),
  assignedVet: z.string().optional().nullable(),
  peso: z.number().optional(),
  sexo: z.enum(['macho', 'hembra', '']).optional(),
  fechaNacimiento: z.string().optional().nullable(),
  color: z.string().optional(),
  alergias: z.array(z.string()).optional(),
  esterilizado: z.boolean().optional(),
  microchip: z.string().optional(),
  notasEspeciales: z.string().optional(),
  propietario: z.string().optional(),
});

export const PetController = {
  create: apiHandler(async (req: Request, { user }) => {
    const body = await req.json();
    const data = createPetSchema.parse(body);

    const pet = await PetService.create({
      ...data,
      propietario: data.propietario || user?.id
    } as any);
    return NextResponse.json(pet, { status: 201 });
  }, { requireAuth: true }),

  listByOwner: apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) throw new AppError("El ID de usuario es requerido", 400);

    const pets = await PetService.listByOwner(userId);
    return NextResponse.json(pets);
  }, { requiredRoles: ["veterinario", "administrador"] }),

  listMyPets: apiHandler(async (req, { user }) => {
    const pets = await PetService.listByOwner(user!.id);
    return NextResponse.json(pets);
  }, { requireAuth: true }),

  listAll: apiHandler(async () => {
    const pets = await PetService.listAll();
    return NextResponse.json(pets);
  }, { requiredRoles: ["veterinario", "administrador"] }),

  getOne: apiHandler(async (req: Request, { user, params }) => {
    const { searchParams } = new URL(req.url);
    const id = params?.id || searchParams.get("id");
    if (!id) throw new AppError("El ID es requerido", 400);

    const pet = await PetService.getOne(id, user!);
    return NextResponse.json(pet);
  }, { requireAuth: true }),

  update: apiHandler(async (req: Request, { user, params }) => {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = params?.id || searchParams.get("id");

    if (!id) throw new AppError("El ID es requerido", 400);

    const updatedPet = await PetService.update(id, body, user!);
    return NextResponse.json(updatedPet);
  }, { requireAuth: true }),

  delete: apiHandler(async (req: Request, { user, params }) => {
    const { searchParams } = new URL(req.url);
    const id = params?.id || searchParams.get("id");

    if (!id) throw new AppError("El ID es requerido", 400);

    const deletedPet = await PetService.delete(id, user!);
    return NextResponse.json(deletedPet);
  }, { requireAuth: true }),
};
