export interface Appointment {
    _id: string;
    date: string;
    reason: string;
    status: string;
    pet: {
        _id: string;
        nombre: string;
        especie?: string;
        raza?: string;
        edad?: string;
        propietario: {
            name: string;
            telefono?: string;
        }
    };
    veterinarian: { _id: string; name: string };
}

export interface Pet {
    _id: string;
    nombre: string;
    propietario: { _id: string; name: string };
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export interface AppointmentFormData {
    pet: string;
    date: string;
    reason: string;
}

export interface ReasonModalData {
    reason: string;
    pet: string;
    date: string;
}

export type AppointmentStatus = "pendiente" | "aceptada" | "cancelada" | "completado";
