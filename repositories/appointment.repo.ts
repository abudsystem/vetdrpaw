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
    return Appointment.find()
      .populate({
        path: "pet",
        populate: {
          path: "propietario",
          select: "name telefono email"
        }
      })
      .populate("veterinarian", "name email")
      .sort({ date: -1 });
  },
  find: async (query: any): Promise<IAppointment[]> => {
    await dbConnect();
    return Appointment.find(query)
      .populate({
        path: "pet",
        populate: {
          path: "propietario",
          select: "name telefono email"
        }
      })
      .populate("veterinarian", "name email")
      .sort({ date: -1 });
  },
  findById: async (id: string): Promise<IAppointment | null> => {
    await dbConnect();
    return Appointment.findById(id)
      .populate({
        path: "pet",
        populate: {
          path: "propietario",
          select: "name telefono email"
        }
      })
      .populate("veterinarian", "name email");
  },
  updateById: async (id: string, data: UpdateQuery<IAppointment>): Promise<IAppointment | null> => {
    await dbConnect();
    return Appointment.findByIdAndUpdate(id, data, { new: true });
  },
  deleteById: async (id: string): Promise<void> => {
    await dbConnect();
    await Appointment.findByIdAndDelete(id);
  },
};
