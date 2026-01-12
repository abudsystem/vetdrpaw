import { PetRepository } from "@/repositories/pet.repo";
import { IPet } from "@/models/Pet";
import { UpdateQuery } from "mongoose";
import { UserPayload } from "@/types/auth";
import { AppError } from "@/lib/api-handler";

export const PetService = {
  create: (data: Partial<IPet>) => PetRepository.create(data),

  listByOwner: (ownerId: string) => PetRepository.findByOwner(ownerId),

  listAll: () => PetRepository.findAll(),

  getOne: async (id: string, user: UserPayload) => {
    const pet = await PetRepository.findById(id);
    if (!pet) throw new AppError("Mascota no encontrada", 404);

    // Ownership check
    if (user.role === "cliente" && pet.propietario?._id?.toString() !== user.id) {
      throw new AppError("Acceso denegado", 403);
    }

    return pet;
  },

  update: async (id: string, data: UpdateQuery<IPet>, user: UserPayload) => {
    const pet = await PetRepository.findById(id);
    if (!pet) throw new AppError("Mascota no encontrada", 404);

    // Ownership check
    if (user.role === "cliente" && pet.propietario?._id?.toString() !== user.id) {
      throw new AppError("Acceso denegado", 403);
    }

    return PetRepository.updateById(id, data);
  },

  delete: async (id: string, user: UserPayload) => {
    const pet = await PetRepository.findById(id);
    if (!pet) throw new AppError("Mascota no encontrada", 404);

    // Ownership check
    if (user.role === "cliente" && pet.propietario?._id?.toString() !== user.id) {
      throw new AppError("Acceso denegado", 403);
    }

    return PetRepository.deleteById(id);
  },
};
