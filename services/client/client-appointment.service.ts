const API_URL = "/api/cliente/citas";

export const ClientAppointmentService = {
    async getAppointments(token: string) {
        const res = await fetch(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener citas");
        return res.json();
    },

    async createAppointment(data: any, token: string) {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al crear cita");
        return res.json();
    },

    async updateAppointment(id: string, data: any, token: string) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar cita");
        return res.json();
    },

    async deleteAppointment(id: string, token: string) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al eliminar cita");
        return res.json();
    },
};
