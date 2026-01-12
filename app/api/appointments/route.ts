import { AppointmentController } from "@/controllers/appointment.controller";

export const GET = AppointmentController.list;
export const POST = AppointmentController.create;
export const PUT = AppointmentController.update;
export const PATCH = AppointmentController.update;
