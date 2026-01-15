"use client";

import { useState, useEffect } from "react";
import { PatientList } from "@/components/veterinario/mascotas/PatientList";
import { GuestUserForm } from "@/components/veterinario/GuestUserForm";
import { Pet } from "@/types/pet";
import { UserPlus, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function VetPatientsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("VetPanel.patients");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await fetch("/api/pets"); // Fetches all pets for vet
      if (res.ok) {
        const data = await res.json();
        console.log("Vet Patients Data:", data);
        setPets(data);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(
    (pet) =>
      pet.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.especie && pet.especie.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.propietario?.name && pet.propietario.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          {t("title")}
        </h1>

        <button
          onClick={() => setShowGuestForm((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition shadow-md hover:shadow-lg"
        >
          <UserPlus size={20} />
          {t("button")}
        </button>
      </div>

      {/* FORMULARIO (empuja hacia abajo) */}
      {showGuestForm && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
          <GuestUserForm
            onClose={() => setShowGuestForm(false)}
            onSuccess={() => {
              console.log(t("newGuest"));
            }}
          />
        </div>
      )}

      {/* Search Bar */}
      <div>
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p>{t("loading")}</p>
      ) : (
        <PatientList patients={filteredPets} />
      )}
    </div>
  );

}
