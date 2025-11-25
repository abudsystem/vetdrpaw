import { PetRepository } from "@/repositories/pet.repo";
import { IPet } from "@/models/Pet";
import { UpdateQuery } from "mongoose";

export const PetService = {
  create: (data: Partial<IPet>) => PetRepository.create(data),
  listByOwner: (ownerId: string) => PetRepository.findByOwner(ownerId),
  listAll: () => PetRepository.findAll(),
  getOne: (id: string) => PetRepository.findById(id),
  update: (id: string, data: UpdateQuery<IPet>) => PetRepository.updateById(id, data),
  delete: (id: string) => PetRepository.deleteById(id),
};
