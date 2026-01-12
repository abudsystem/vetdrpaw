import { PetController } from "@/controllers/pet.controller";

export const GET = PetController.listMyPets;
export const POST = PetController.create;
