import { useState } from "react";
import { Appointment, AppointmentFormData, AppointmentStatus } from "@/components/veterinario/citas/types";
import { filterByStatus, getPaginatedData, getTotalPages } from "@/components/veterinario/citas/utils";
import { AppointmentServices } from "@/lib/api/appointment.service";
import { UserServices } from "@/lib/api/user.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useVetAppointments = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<AppointmentStatus>("pendiente");
    const [currentPage, setCurrentPage] = useState<{ [key in AppointmentStatus]: number }>({
        pendiente: 1,
        aceptada: 1,
        cancelada: 1,
    });

    // Valid data is expected from services.
    const { data: appointments = [], isLoading: loadingAppointments } = useQuery({
        queryKey: ['appointments', 'veterinarian'],
        queryFn: () => AppointmentServices.getAllVeterinaryAppointments(),
    });

    const { data: currentUser, isLoading: loadingUser } = useQuery({
        queryKey: ['user', 'veterinarian'],
        queryFn: () => UserServices.getUserVeterinarianProfile(),
    });

    const loading = loadingAppointments || loadingUser;

    const createMutation = useMutation({
        mutationFn: async (formData: AppointmentFormData) => {
            if (!currentUser) throw new Error("No user");
            return AppointmentServices.createNewAppointment({
                ...formData,
                veterinarian: currentUser._id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments', 'veterinarian'] });
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            AppointmentServices.updateAppointmentStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments', 'veterinarian'] });
            queryClient.invalidateQueries({ queryKey: ['appointments', 'mine'] }); // Invalidate dashboard too
        },
    });

    const createAppointment = async (formData: AppointmentFormData) => {
        try {
            await createMutation.mutateAsync(formData);
            return true;
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert("Error creando cita");
            return false;
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Filter and Pagination Logic
    const filteredAppointments = filterByStatus(appointments, activeTab);
    const totalPages = getTotalPages(filteredAppointments.length);
    const paginatedAppointments = getPaginatedData(
        filteredAppointments,
        currentPage[activeTab]
    );

    const handlePageChange = (page: number) => {
        setCurrentPage((prev) => ({ ...prev, [activeTab]: page }));
    };

    return {
        appointments,
        currentUser,
        loading,
        activeTab,
        setActiveTab,
        currentPage: currentPage[activeTab],
        totalPages,
        totalItems: filteredAppointments.length,
        paginatedAppointments,
        handlePageChange,
        updateStatus,
        createAppointment,
        refreshAppointments: () => queryClient.invalidateQueries({ queryKey: ['appointments', 'veterinarian'] })
    };
};
