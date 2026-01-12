import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentTable from './AppointmentTable';
import { describe, it, expect, vi } from 'vitest';
import { Appointment } from './types';

const mockAppointments: Appointment[] = [
    {
        _id: '1',
        date: new Date().toISOString(),
        reason: 'Regular checkup',
        status: 'pendiente',
        pet: {
            _id: 'pet1',
            nombre: 'Fido',
            especie: 'Perro',
            raza: 'Labrador',
            edad: '2',
            propietario: {
                name: 'Juan Perez'
            }
        },
        veterinarian: {
            _id: 'vet1',
            name: 'Dr. Smith'
        }
    }
];

describe('AppointmentTable Component', () => {
    const onUpdateStatus = vi.fn();
    const onViewReason = vi.fn();

    it('renders appointment details correctly', () => {
        render(
            <AppointmentTable
                appointments={mockAppointments}
                onUpdateStatus={onUpdateStatus}
                onViewReason={onViewReason}
            />
        );

        expect(screen.getByText('Fido')).toBeInTheDocument();
        expect(screen.getByText('Juan Perez')).toBeInTheDocument();
        expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
        expect(screen.getByText('Regular checkup')).toBeInTheDocument();
    });

    it('calls onUpdateStatus when action buttons are clicked', () => {
        render(
            <AppointmentTable
                appointments={mockAppointments}
                onUpdateStatus={onUpdateStatus}
                onViewReason={onViewReason}
            />
        );

        // Map status keys to translated values in mocks (which just return the key)
        const acceptButton = screen.getByText('accept');
        fireEvent.click(acceptButton);
        expect(onUpdateStatus).toHaveBeenCalledWith('1', 'aceptada');

        const cancelButton = screen.getByText('cancel');
        fireEvent.click(cancelButton);
        expect(onUpdateStatus).toHaveBeenCalledWith('1', 'cancelada');

        const completeButton = screen.getByText('complete');
        fireEvent.click(completeButton);
        expect(onUpdateStatus).toHaveBeenCalledWith('1', 'completado');
    });

    it('expands patient details when clicked', () => {
        render(
            <AppointmentTable
                appointments={mockAppointments}
                onUpdateStatus={onUpdateStatus}
                onViewReason={onViewReason}
            />
        );

        const patientName = screen.getByText('Fido');
        fireEvent.click(patientName);

        // These should appear after expansion
        expect(screen.getByText(/Perro/)).toBeInTheDocument();
        expect(screen.getByText(/Labrador/)).toBeInTheDocument();
    });
});
