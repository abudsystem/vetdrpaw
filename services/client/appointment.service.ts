import { Appointment, AppointmentFormData } from '@/components/veterinario/citas/types';

const API_URL = '/api/appointments';

export const AppointmentServices = {
    async getAllVeterinaryAppointments(): Promise<Appointment[]> {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error fetching appointments');
        return res.json();
    },

    async createNewAppointment(data: AppointmentFormData & { veterinarian: string }): Promise<Appointment> {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Error creating appointment');
        }
        return res.json();
    },

    async updateAppointmentStatus(id: string, status: string): Promise<void> {
        const res = await fetch(`${API_URL}?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error('Error updating status');
    }
};
