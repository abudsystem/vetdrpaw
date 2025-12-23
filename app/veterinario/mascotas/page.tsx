"use client";

import { useState, useEffect } from "react";
import { PatientList } from "@/components/veterinario/mascotas/PatientList";
import { GuestUserForm } from "@/components/veterinario/GuestUserForm";
import { Pet } from "@/types/pet";
import { UserPlus } from "lucide-react";

export default function VetPatientsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGuestForm, setShowGuestForm] = useState(false);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Pacientes</h1>

        <button
          onClick={() => setShowGuestForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition shadow-md hover:shadow-lg"
        >
          <UserPlus size={20} />
          Registrar Nuevo Cliente
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <PatientList patients={pets} />
      )}

      {showGuestForm && (
        <GuestUserForm
          onClose={() => setShowGuestForm(false)}
          onSuccess={() => {
            // Optionally refresh data or show success message
            console.log("Guest user created successfully");
          }}
        />
      )}
    </div>
  );
}
