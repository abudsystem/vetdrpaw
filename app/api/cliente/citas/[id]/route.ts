import { AppointmentController } from "@/controllers/appointment.controller";

export const GET = AppointmentController.getById;
export const PUT = AppointmentController.update;
export const DELETE = AppointmentController.delete;
