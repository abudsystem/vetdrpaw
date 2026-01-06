"use client";

import { useState, useEffect } from "react";
import { ReasonModalData } from "@/components/veterinario/citas/types";
import { useVetAppointments } from "@/hooks/useVetAppointments";
import AppointmentForm from "@/components/veterinario/citas/AppointmentForm";
import AppointmentTabs from "@/components/veterinario/citas/AppointmentTabs";
import AppointmentMobileCard from "@/components/veterinario/citas/AppointmentMobileCard";
import AppointmentTable from "@/components/veterinario/citas/AppointmentTable";
import AppointmentPagination from "@/components/veterinario/citas/AppointmentPagination";
import ReasonModal from "@/components/veterinario/citas/ReasonModal";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function VetAppointmentsPage() {
    const {
        appointments,
        currentUser,
        loading,
        activeTab,
        setActiveTab,
        currentPage,
        totalPages,
        totalItems,
        paginatedAppointments,
        handlePageChange,
        updateStatus,
        createAppointment
    } = useVetAppointments();

    const searchParams = useSearchParams();
    const highlightId = searchParams.get('highlight');

    const [showForm, setShowForm] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState<ReasonModalData | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Scroll to and highlight appointment if highlight parameter is present
    useEffect(() => {
        if (highlightId) {
            // Find the appointment and switch to its tab
            const appointment = appointments.find(app => app._id === highlightId);
            if (appointment) {
                setActiveTab(appointment.status as any);

                // Scroll to the element after a short delay to ensure it's rendered
                setTimeout(() => {
                    const element = document.getElementById(`appointment-${highlightId}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        }
    }, [highlightId, appointments, setActiveTab]);

    // Filter appointments by search term
    const searchFilteredAppointments = paginatedAppointments.filter(
        (appointment) =>
            (appointment.pet?.nombre && appointment.pet.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (appointment.pet?.propietario?.name && appointment.pet.propietario.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSubmit = async (formData: any) => {
        const success = await createAppointment(formData);
        if (success) {
            setShowForm(false);
        }
    };

    const handleViewReason = (reason: string, pet: string, date: string) => {
        setSelectedReason({ reason, pet, date });
        setShowReasonModal(true);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Citas</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    {showForm ? "Cancelar" : "Nueva Cita"}
                </button>
            </div>

            {showForm && (
                <AppointmentForm
                    currentUser={currentUser}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <>
                    <AppointmentTabs
                        activeTab={activeTab}
                        appointments={appointments}
                        onTabChange={setActiveTab}
                    />

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por mascota o cliente..."
                                className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {searchFilteredAppointments.length === 0 ? (
                        <div className="text-center py-12 text-gray-700 bg-white rounded-lg shadow">
                            No hay citas {activeTab}s
                        </div>
                    ) : (
                        <>
                            {/* MOBILE VIEW */}
                            <div className="md:hidden space-y-4">
                                {searchFilteredAppointments.map((app) => (
                                    <div
                                        key={app._id}
                                        id={`appointment-${app._id}`}
                                        className={highlightId === app._id ? 'ring-4 ring-teal-400 rounded-lg animate-pulse' : ''}
                                    >
                                        <AppointmentMobileCard
                                            appointment={app}
                                            onUpdateStatus={updateStatus}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* DESKTOP VIEW */}
                            <AppointmentTable
                                appointments={searchFilteredAppointments}
                                onUpdateStatus={updateStatus}
                                onViewReason={handleViewReason}
                                highlightId={highlightId}
                            />

                            {/* Pagination */}
                            <AppointmentPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}

                    {showReasonModal && selectedReason && (
                        <ReasonModal
                            data={selectedReason}
                            onClose={() => setShowReasonModal(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
}
