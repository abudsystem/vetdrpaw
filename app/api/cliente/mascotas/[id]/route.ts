import { PetController } from "@/controllers/pet.controller";

export const GET = PetController.getOne;
export const PUT = PetController.update;
export const DELETE = PetController.delete;
