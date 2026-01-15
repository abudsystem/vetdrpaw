import { useState, useEffect } from "react";
import { User, Pet, AppointmentFormData } from "./types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useTranslations } from "next-intl";

interface AppointmentFormProps {
    currentUser: User | null;
    onSubmit: (formData: AppointmentFormData) => Promise<void>;
    onCancel: () => void;
}

export default function AppointmentForm({

    currentUser,
    onSubmit,
    onCancel,
}: AppointmentFormProps) {
    const [clientSearch, setClientSearch] = useState("");
    const [clients, setClients] = useState<User[]>([]);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);
    const [clientPets, setClientPets] = useState<Pet[]>([]);

    const [formData, setFormData] = useState<AppointmentFormData>({
        pet: "",
        date: "",
        reason: "",
    });

    // Debounce client search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (clientSearch.length > 2) {
                searchClients();
            } else {
                setClients([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [clientSearch]);

    const searchClients = async () => {
        try {
            const res = await fetch(
                `/api/users?role=cliente&search=${clientSearch}`
            );
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (error) {
            console.error("Error searching clients:", error);
        }
    };

    const handleClientSelect = async (client: User) => {
        setSelectedClient(client);
        setClients([]);
        setClientSearch(client.name);

        try {
            const res = await fetch(`/api/pets?userId=${client._id}`);
            if (res.ok) {
                const data = await res.json();
                setClientPets(data);
            }
        } catch (error) {
            console.error("Error fetching client pets:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ pet: "", date: "", reason: "" });
        setSelectedClient(null);
        setClientSearch("");
        setClientPets([]);
    };
    const t = useTranslations("VetPanel.appointments");
    return (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl text-black font-semibold mb-4">
                {t("NewAppointment")}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {/* Client Search */}
                <div className="relative">
                    <Label className="block text-sm font-medium text-gray-700">
                        {t("searchClient")}
                    </Label>

                    <Input
                        type="text"
                        placeholder={t("placeHolderClient")}
                        value={clientSearch}
                        onChange={(e) => {
                            setClientSearch(e.target.value);
                            if (selectedClient) {
                                setSelectedClient(null);
                                setClientPets([]);
                                setFormData({ ...formData, pet: "" });
                            }
                        }}
                    />

                    {clients.length > 0 && !selectedClient && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow max-h-60 overflow-auto mt-1">
                            {clients.map((client) => (
                                <li
                                    key={client._id}
                                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-900"
                                    onClick={() => handleClientSelect(client)}
                                >
                                    <div className="font-medium">
                                        {client.name}
                                    </div>
                                    <div className="text-xs text-gray-700">
                                        {client.email}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Pet Select */}
                <div>
                    <Label className="block text-sm text-black font-medium">
                        {t("pet")}
                    </Label>

                    <select
                        required
                        disabled={!selectedClient}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 text-black h-10"
                        value={formData.pet}
                        onChange={(e) =>
                            setFormData({ ...formData, pet: e.target.value })
                        }
                    >
                        <option value="">
                            {selectedClient
                                ? t("selectAPet")
                                : t("firstClient")}
                        </option>

                        {clientPets.map((pet) => (
                            <option key={pet._id} value={pet._id}>
                                {pet.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date and Time */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700">
                        {t("date")}
                    </Label>

                    <Input
                        type="datetime-local"
                        required
                        value={formData.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                    />
                </div>

                {/* Reason */}
                <div className="md:col-span-2">
                    <Label className="block text-sm font-medium text-gray-700">
                        {t("reason")}
                    </Label>

                    <Input
                        type="text"
                        required
                        placeholder={t("reasonPlaceholder")}
                        value={formData.reason}
                        onChange={(e) =>
                            setFormData({ ...formData, reason: e.target.value })
                        }
                    />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                    <Button
                        type="submit"
                        disabled={!formData.pet}
                        className="w-full"
                    >
                        {t("saveAppointment")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
