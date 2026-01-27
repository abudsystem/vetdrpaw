import { useState, useEffect } from "react";
import { Appointment, AppointmentFormData, AppointmentStatus } from "@/components/veterinario/citas/types";
import { filterByStatus, getPaginatedData, getTotalPages, sortAppointmentsByDate } from "@/components/veterinario/citas/utils";
import { AppointmentServices } from "@/services/client/appointment.service";
import { UserServices } from "@/services/client/user.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useVetAppointments = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<AppointmentStatus>("pendiente");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState<{ [key in AppointmentStatus]: number }>({
        pendiente: 1,
        aceptada: 1,
        cancelada: 1,
        completado: 1,
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

    // Reset to page 1 when searching
    useEffect(() => {
        setCurrentPage((prev) => {
            const reset: any = { ...prev };
            Object.keys(reset).forEach(key => {
                reset[key] = 1;
            });
            return reset;
        });
    }, [searchTerm]);

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

    // 1. Filter by Status and Sort by Date (Newest First)
    const statusFiltered = filterByStatus(appointments, activeTab);

    // 2. Global Search (within the current tab)
    const searchFiltered = statusFiltered.filter(app => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (app.pet?.nombre && app.pet.nombre.toLowerCase().includes(term)) ||
            (app.pet?.propietario?.name && app.pet.propietario.name.toLowerCase().includes(term)) ||
            (app.reason && app.reason.toLowerCase().includes(term))
        );
    });

    // 3. Pagination of the filtered results
    const totalPages = getTotalPages(searchFiltered.length);
    const paginatedAppointments = getPaginatedData(
        searchFiltered,
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
        searchTerm,
        setSearchTerm,
        currentPage: currentPage[activeTab],
        totalPages,
        totalItems: searchFiltered.length,
        paginatedAppointments,
        handlePageChange,
        updateStatus,
        createAppointment,
        refreshAppointments: () => queryClient.invalidateQueries({ queryKey: ['appointments', 'veterinarian'] })
    };
};
