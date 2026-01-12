import { PetCareController } from "@/controllers/pet-care.controller";

export const GET = PetCareController.listAll;
export const POST = PetCareController.create;
