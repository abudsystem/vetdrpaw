"use client";

import { useState, useEffect } from "react";
import { PatientList } from "@/components/veterinario/mascotas/PatientList";
import { GuestUserForm } from "@/components/veterinario/GuestUserForm";
import { Pet } from "@/types/pet";
import { UserPlus, Search } from "lucide-react";

export default function VetPatientsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, especie o dueño..."
            className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <PatientList patients={filteredPets} />
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
