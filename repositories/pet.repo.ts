import { Pet, IPet } from "@/models/Pet";
import dbConnect from "@/lib/db";
import { UpdateQuery } from "mongoose";

export const PetRepository = {
  create: async (data: Partial<IPet>): Promise<IPet> => {
    await dbConnect();
    return Pet.create(data);
  },
  findByOwner: async (ownerId: string): Promise<IPet[]> => {
    await dbConnect();
    return Pet.find({ propietario: ownerId }).populate("propietario assignedVet");
  },
  findAll: async (): Promise<IPet[]> => {
    await dbConnect();
    return Pet.find().populate("propietario assignedVet").lean();
  },
  findById: async (id: string): Promise<IPet | null> => {
    await dbConnect();
    return Pet.findById(id).populate("propietario assignedVet").lean();
  },
  updateById: async (id: string, data: UpdateQuery<IPet>): Promise<IPet | null> => {
    await dbConnect();
    return Pet.findByIdAndUpdate(id, data, { new: true });
  },
  deleteById: async (id: string): Promise<IPet | null> => {
    await dbConnect();
    return Pet.findByIdAndDelete(id);
  },
};
