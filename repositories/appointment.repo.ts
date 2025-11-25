import { Appointment, IAppointment } from "@/models/Appointment";
import dbConnect from "@/lib/db";
import { UpdateQuery } from "mongoose";

export const AppointmentRepository = {
  create: async (data: Partial<IAppointment>): Promise<IAppointment> => {
    await dbConnect();
    return Appointment.create(data);
  },
  list: async (): Promise<IAppointment[]> => {
    await dbConnect();
    return Appointment.find().populate("pet").populate("veterinarian");
  },
  findById: async (id: string): Promise<IAppointment | null> => {
    await dbConnect();
    return Appointment.findById(id);
  },
  updateById: async (id: string, data: UpdateQuery<IAppointment>): Promise<IAppointment | null> => {
    await dbConnect();
    return Appointment.findByIdAndUpdate(id, data, { new: true });
  },
};
