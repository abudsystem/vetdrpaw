import { Service } from '@/types/service';

const API_URL = '/api/services';

export const MedicalServices = {
    async getAllMedicalServices(activeOnly: boolean): Promise<Service[]> {
        const query = activeOnly ? "?activeOnly=true" : "";
        const res = await fetch(`${API_URL}${query}`);
        if (!res.ok) throw new Error('Error fetching services');
        return res.json();
    },

    async toggleMedicalServiceStatus(id: string): Promise<boolean> {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
        });
        return res.ok;
    }
};
