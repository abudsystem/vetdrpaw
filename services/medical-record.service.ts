import { MedicalRecordRepository } from "@/repositories/medical-record.repo";
import { IMedicalRecord } from "@/models/MedicalRecord";
import { PetRepository } from "@/repositories/pet.repo";
import { UserPayload } from "@/types/auth";
import { AppError } from "@/lib/api-handler";

export const MedicalRecordService = {
    async create(data: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
        return MedicalRecordRepository.create(data);
    },

    async findByPet(petId: string, user: UserPayload): Promise<IMedicalRecord[]> {
        const pet = await PetRepository.findById(petId);
        if (!pet) throw new AppError("Mascota no encontrada", 404);

        // Security: Clients can only see records of their own pets
        if (user.role === "cliente" && pet.propietario?._id?.toString() !== user.id) {
            throw new AppError("Acceso denegado", 403);
        }

        return MedicalRecordRepository.findByPet(petId);
    },

    async update(id: string, data: Partial<IMedicalRecord>): Promise<IMedicalRecord | null> {
        return MedicalRecordRepository.update(id, data);
    },

    async delete(id: string): Promise<void> {
        await MedicalRecordRepository.delete(id);
    },
};
