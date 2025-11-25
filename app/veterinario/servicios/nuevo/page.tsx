"use client";

import ServiceForm from "@/components/ServiceForm";
import { useRouter } from "next/navigation";

export default function NewServicePage() {
    const router = useRouter();

    const handleCreate = async (data: any) => {
        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push("/veterinario/servicios");
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Error creating service:", error);
            alert("Error al crear el servicio");
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Servicio Veterinario</h1>
            <ServiceForm onSubmit={handleCreate} />
        </div>
    );
}
