"use client";

import { useState } from "react";
import { ReasonModalData } from "@/components/veterinario/citas/types";
import { useVetAppointments } from "@/hooks/useVetAppointments";
import AppointmentForm from "@/components/veterinario/citas/AppointmentForm";
import AppointmentTabs from "@/components/veterinario/citas/AppointmentTabs";
import AppointmentMobileCard from "@/components/veterinario/citas/AppointmentMobileCard";
import AppointmentTable from "@/components/veterinario/citas/AppointmentTable";
import AppointmentPagination from "@/components/veterinario/citas/AppointmentPagination";
import ReasonModal from "@/components/veterinario/citas/ReasonModal";

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

    const [showForm, setShowForm] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState<ReasonModalData | null>(null);

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
        <div className="p-4 md:p-0">
            <div className="flex justify-between items-center mb-6">
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

                    {paginatedAppointments.length === 0 ? (
                        <div className="text-center py-12 text-gray-700 bg-white rounded-lg shadow">
                            No hay citas {activeTab}s
                        </div>
                    ) : (
                        <>
                            {/* MOBILE VIEW */}
                            <div className="md:hidden space-y-4">
                                {paginatedAppointments.map((app) => (
                                    <AppointmentMobileCard
                                        key={app._id}
                                        appointment={app}
                                        onUpdateStatus={updateStatus}

                                    />
                                ))}
                            </div>

                            {/* DESKTOP VIEW */}
                            <AppointmentTable
                                appointments={paginatedAppointments}
                                onUpdateStatus={updateStatus}
                                onViewReason={handleViewReason}
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
