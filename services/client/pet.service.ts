import { Pet } from '@/types/pet';

const API_URL = '/api/pets';

export const PetServices = {
    async getClientPets(): Promise<Pet[]> {
        const res = await fetch(`${API_URL}?my_pets=true`);
        if (!res.ok) throw new Error('Error fetching pets');
        return res.json();
    },

    async registerNewPet(data: any): Promise<boolean> {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.ok;
    },

    async updatePetDetails(id: string, data: any): Promise<boolean> {
        const res = await fetch(`${API_URL}?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.ok;
    },

    async removePet(id: string): Promise<boolean> {
        const res = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE',
        });
        return res.ok;
    }
};
