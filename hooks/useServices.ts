import { useState, useEffect, useCallback } from 'react';
import { Service } from '@/types/service';
import { MedicalServices } from "@/services/client/medical.service";

export const useServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showActiveOnly, setShowActiveOnly] = useState(false);

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await MedicalServices.getAllMedicalServices(showActiveOnly);
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    }, [showActiveOnly]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const toggleServiceStatus = async (id: string) => {
        if (!confirm("¿Estás seguro de cambiar el estado de este servicio?")) return;

        try {
            const success = await MedicalServices.toggleMedicalServiceStatus(id);
            if (success) {
                fetchServices();
            } else {
                alert("Error al cambiar el estado");
            }
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    return {
        services,
        loading,
        showActiveOnly,
        setShowActiveOnly,
        toggleServiceStatus,
        refreshServices: fetchServices
    };
};
