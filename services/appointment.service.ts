import { AppointmentRepository } from "@/repositories/appointment.repo";
import { IAppointment } from "@/models/Appointment";
import { UpdateQuery } from "mongoose";

export const AppointmentService = {
  create: (data: Partial<IAppointment>) => AppointmentRepository.create(data),
  list: () => AppointmentRepository.list(),
  update: (id: string, data: UpdateQuery<IAppointment>) => AppointmentRepository.updateById(id, data),
};
