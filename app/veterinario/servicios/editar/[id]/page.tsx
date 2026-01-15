"use client";

import { useState, useEffect } from "react";
import ServiceForm from "@/components/ServiceForm";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EditServicePage() {
    const t = useTranslations("VetPanel.services");
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchService();
        }
    }, [id]);

    const fetchService = async () => {
        try {
            const res = await fetch(`/api/services/${id}`);
            if (res.ok) {
                const data = await res.json();
                // Transform populated supplies to match form format
                const formattedData = {
                    ...data,
                    supplies: data.supplies.map((s: any) => ({
                        product: s.product._id,
                        productName: s.product.name,
                        quantity: s.quantity,
                    })),
                };
                setInitialData(formattedData);
            } else {
                alert(t("noFind"));
                router.push("/veterinario/servicios");
            }
        } catch (error) {
            console.error(t("noFind"), error);
            alert(t("noFind"));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (data: any) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "PUT",
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
            console.error(t("noUpdateError"), error);
            alert(t("noUpdateError"));
        }
    };

    if (loading) return <p>{t("loading")}</p>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t("editService")}</h1>
            {initialData && (
                <ServiceForm
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    isEditing={true}
                />
            )}
        </div>
    );
}
