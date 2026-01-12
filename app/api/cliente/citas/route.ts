import { AppointmentController } from "@/controllers/appointment.controller";

export async function GET(req: Request) {
  // Para clientes, list siempre filtra por sus propias citas
  const url = new URL(req.url);
  url.searchParams.set("my_appointments", "true");
  const modReq = new Request(url, req);
  return AppointmentController.list(modReq);
}

export const POST = AppointmentController.create;
