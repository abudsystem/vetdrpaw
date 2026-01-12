import { User } from '@/types/user';

const API_URL = '/api/users';

export const UserServices = {
    // Descriptive aliases for profile fetching
    async getUserVeterinarianProfile(): Promise<any> {
        return this.getCurrentUserProfile();
    },

    async getUserClientProfile(): Promise<any> {
        return this.getCurrentUserProfile();
    },

    async getUserAdminProfile(): Promise<any> {
        return this.getCurrentUserProfile();
    },

    // Core methods
    async getCurrentUserProfile(): Promise<any> {
        const res = await fetch(`${API_URL}/me`);
        if (!res.ok) {
            if (res.status === 401) throw new Error('Unauthorized');
            throw new Error('Error fetching profile');
        }
        return res.json();
    },

    async getAllSystemUsers(): Promise<User[]> {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error fetching users');
        return res.json();
    },

    async deleteUserById(id: string): Promise<boolean> {
        const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        return res.ok;
    },

    async updateUserById(id: string, data: Partial<User>): Promise<User> {
        const res = await fetch(`${API_URL}?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Error updating user');
        return res.json();
    }
};
