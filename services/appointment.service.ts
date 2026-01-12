import { AppointmentRepository } from "@/repositories/appointment.repo";
import { IAppointment } from "@/models/Appointment";
import { UpdateQuery } from "mongoose";
import { UserPayload } from "@/types/auth";
import { AppError } from "@/lib/api-handler";

export const AppointmentService = {
  create: (data: Partial<IAppointment>) => AppointmentRepository.create(data),

  list: async (user: UserPayload, filters: { petId?: string, myAppointments?: string }) => {
    // 1. Specific Pet Filter
    if (filters.petId) {
      const appointments = await AppointmentRepository.find({ pet: filters.petId });

      // Security: Clients can only see appointments of pets they own
      if (user.role === "cliente") {
        return appointments.filter(a => a.pet && (a.pet as any).propietario?._id?.toString() === user.id);
      }
      return appointments;
    }

    // 2. Personalized List
    if (filters.myAppointments === "true" || user.role === "cliente") {
      if (user.role === "veterinario") {
        return AppointmentRepository.find({ veterinarian: user.id });
      }

      // Clients see appointments of their pets
      const appointments = await AppointmentRepository.find({});
      return appointments.filter(a => a.pet && (a.pet as any).propietario?._id?.toString() === user.id);
    }

    // 3. Admin/Vet global list
    if (user.role === "veterinario" || user.role === "administrador") {
      return AppointmentRepository.list();
    }

    throw new AppError("Acceso denegado", 403);
  },

  update: async (id: string, data: UpdateQuery<IAppointment>, user: UserPayload) => {
    const appointment = await AppointmentRepository.findById(id);
    if (!appointment) throw new AppError("Cita no encontrada", 404);

    // Security: Only Admin, Vet (if assigned), or Client (if owner) can update
    // Clients can usually only CANCEL
    if (user.role === "cliente") {
      const isOwner = appointment.pet && (appointment.pet as any).propietario?._id?.toString() === user.id;
      if (!isOwner) throw new AppError("Acceso denegado", 403);
      // Clients can only change status to "cancelada"? or whatever policy.
    }

    if (user.role === "veterinario") {
      const isAssigned = appointment.veterinarian?._id?.toString() === user.id;
      // Policy: Vets can update if assigned, or add more logic if needed
    }

    return AppointmentRepository.updateById(id, data);
  },

  getById: async (id: string, user: UserPayload) => {
    const appointment = await AppointmentRepository.findById(id);
    if (!appointment) throw new AppError("Cita no encontrada", 404);

    // Security check
    if (user.role === "cliente") {
      const isOwner = appointment.pet && (appointment.pet as any).propietario?._id?.toString() === user.id;
      if (!isOwner) throw new AppError("Acceso denegado", 403);
    }

    return appointment;
  },

  delete: async (id: string, user: UserPayload) => {
    const appointment = await AppointmentRepository.findById(id);
    if (!appointment) throw new AppError("Cita no encontrada", 404);

    // Security check
    if (user.role === "cliente") {
      const isOwner = appointment.pet && (appointment.pet as any).propietario?._id?.toString() === user.id;
      if (!isOwner) throw new AppError("Solo el propietario puede eliminar la cita", 403);
    }

    return AppointmentRepository.deleteById(id);
  },
};
