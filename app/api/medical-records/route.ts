import { MedicalRecordController } from "@/controllers/medical-record.controller";

export const GET = MedicalRecordController.listByPet;
export const POST = MedicalRecordController.create;
export const PUT = MedicalRecordController.update;
export const DELETE = MedicalRecordController.delete;
