import { MedicalRecordRepository } from "@/repositories/medical-record.repo";
import { MedicalRecord, IMedicalRecord } from "@/models/MedicalRecord";
import connectDB from "@/lib/db";

export const MedicalRecordService = {
    async create(data: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
        await connectDB();
        const record = await MedicalRecord.create(data);
        return record;
    },

    async findByPet(petId: string): Promise<IMedicalRecord[]> {
        await connectDB();
        const records = await MedicalRecord.find({ pet: petId })
            .populate("veterinarian", "name")
            .sort({ date: -1 });
        return records;
    },

    async update(id: string, data: Partial<IMedicalRecord>): Promise<IMedicalRecord | null> {
        await connectDB();
        const record = await MedicalRecord.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        ).populate("veterinarian", "name");
        return record;
    },

    async delete(id: string): Promise<void> {
        await connectDB();
        await MedicalRecord.findByIdAndDelete(id);
    },
};
