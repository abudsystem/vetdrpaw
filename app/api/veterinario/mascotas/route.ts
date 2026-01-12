import { PetController } from "@/controllers/pet.controller";

export const GET = PetController.listAll;
export const POST = PetController.create;
