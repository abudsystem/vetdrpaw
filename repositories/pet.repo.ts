import { Pet, IPet } from "@/models/Pet";
import dbConnect from "@/lib/db";
import {
  UpdateQuery,
  HydratedDocument,
  InferSchemaType
} from "mongoose";

// Tipo lean para resultados .lean()
type PetLean = InferSchemaType<typeof Pet.schema>;

export const PetRepository = {
  // Crea una mascota → retorna documento de mongoose (NO lean)
  create: async (data: Partial<IPet>): Promise<HydratedDocument<IPet>> => {
    await dbConnect();
    return Pet.create(data);
  },

  // Mascotas por propietario → documento mongoose (NO lean)
  findByOwner: async (ownerId: string): Promise<HydratedDocument<IPet>[]> => {
    await dbConnect();
    return Pet.find({ propietario: ownerId })
      .populate("propietario assignedVet");
  },

  // Todas las mascotas → AQUÍ SI ES LEAN
  findAll: async (): Promise<PetLean[]> => {
    await dbConnect();
    return Pet.find()
      .populate("propietario assignedVet")
      .lean<PetLean[]>();
  },

  // Buscar una por ID → lean
  findById: async (id: string): Promise<PetLean | null> => {
    await dbConnect();
    return Pet.findById(id)
      .populate("propietario assignedVet")
      .lean<PetLean | null>();
  },

  // Actualizar → documento mongoose
  updateById: async (
    id: string,
    data: UpdateQuery<IPet>
  ): Promise<HydratedDocument<IPet> | null> => {
    await dbConnect();
    return Pet.findByIdAndUpdate(id, data, { new: true });
  },

  // Eliminar → documento mongoose
  deleteById: async (id: string): Promise<HydratedDocument<IPet> | null> => {
    await dbConnect();
    return Pet.findByIdAndDelete(id);
  },
};
