import { MedicalRecord, IMedicalRecord } from "@/models/MedicalRecord";
import dbConnect from "@/lib/db";

export const MedicalRecordRepository = {
    create: async (data: Partial<IMedicalRecord>): Promise<IMedicalRecord> => {
        await dbConnect();
        return MedicalRecord.create(data);
    },
    findByPet: async (petId: string): Promise<IMedicalRecord[]> => {
        await dbConnect();
        return MedicalRecord.find({ pet: petId })
            .populate("veterinarian", "name email")
            .sort({ date: -1 });
    },
    findById: async (id: string): Promise<IMedicalRecord | null> => {
        await dbConnect();
        return MedicalRecord.findById(id).populate("veterinarian", "name email");
    },
    update: async (id: string, data: Partial<IMedicalRecord>): Promise<IMedicalRecord | null> => {
        await dbConnect();
        return MedicalRecord.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .populate("veterinarian", "name email");
    },
    delete: async (id: string): Promise<void> => {
        await dbConnect();
        await MedicalRecord.findByIdAndDelete(id);
    },
};
