"use client";

import { useState, useEffect } from "react";

interface Pet {
  _id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad?: number;
  peso?: number;
  sexo?: string;
  fechaNacimiento?: string;
  color?: string;
  alergias?: string[];
  esterilizado?: boolean;
  microchip?: string;
  notasEspeciales?: string;
}

export default function MyPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "Perro",
    raza: "",
    edad: 0,
    peso: 0,
    sexo: "",
    fechaNacimiento: "",
    color: "",
    alergias: [] as string[],
    esterilizado: false,
    microchip: "",
    notasEspeciales: "",
  });
  const [alergiaInput, setAlergiaInput] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await fetch("/api/pets?my_pets=true");
      if (res.ok) {
        const data = await res.json();
        setPets(data);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/pets?id=${editingId}` : "/api/pets";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        fetchPets();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving pet:", error);
    }
  };

  const handleEdit = (pet: Pet) => {
    setFormData({
      nombre: pet.nombre,
      especie: pet.especie,
      raza: pet.raza,
      edad: pet.edad || 0,
      peso: pet.peso || 0,
      sexo: pet.sexo || "",
      fechaNacimiento: pet.fechaNacimiento || "",
      color: pet.color || "",
      alergias: pet.alergias || [],
      esterilizado: pet.esterilizado || false,
      microchip: pet.microchip || "",
      notasEspeciales: pet.notasEspeciales || "",
    });
    setEditingId(pet._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta mascota?")) return;

    try {
      const res = await fetch(`/api/pets?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchPets();
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      especie: "Perro",
      raza: "",
      edad: 0,
      peso: 0,
      sexo: "",
      fechaNacimiento: "",
      color: "",
      alergias: [],
      esterilizado: false,
      microchip: "",
      notasEspeciales: "",
    });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const addAlergia = () => {
    if (alergiaInput.trim()) {
      setFormData({ ...formData, alergias: [...formData.alergias, alergiaInput.trim()] });
      setAlergiaInput("");
    }
  };

  const removeAlergia = (index: number) => {
    setFormData({ ...formData, alergias: formData.alergias.filter((_, i) => i !== index) });
  };

  const getSpeciesEmoji = (especie: string) => {
    const especieLower = especie.toLowerCase();
    if (especieLower.includes('perro')) return '🐕';
    if (especieLower.includes('gato')) return '🐈';
    return '🐾';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis Mascotas</h1>
        <button
          onClick={() => {
            cancelForm();
            setShowForm(!showForm);
          }}
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
        >
          {showForm ? "Cancelar" : "Nueva Mascota"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Editar Mascota" : "Registrar Mascota"}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Especie *</label>
                  <select
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.especie}
                    onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Raza *</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.raza}
                    onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sexo</label>
                  <select
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.sexo}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Detalles Físicos */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Detalles Físicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.peso || ""}
                    onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color/Marcas</label>
                  <input
                    type="text"
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Ej: Negro con manchas blancas"
                  />
                </div>
              </div>
            </div>

            {/* Información Médica */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información Médica</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alergias Conocidas</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 text-black border border-gray-300 rounded-md shadow-sm p-2"
                      value={alergiaInput}
                      onChange={(e) => setAlergiaInput(e.target.value)}
                      placeholder="Ej: Polen, Pollo"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAlergia())}
                    />
                    <button
                      type="button"
                      onClick={addAlergia}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Agregar
                    </button>
                  </div>
                  {formData.alergias.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.alergias.map((alergia, index) => (
                        <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {alergia}
                          <button
                            type="button"
                            onClick={() => removeAlergia(index)}
                            className="hover:text-red-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="esterilizado"
                    checked={formData.esterilizado}
                    onChange={(e) => setFormData({ ...formData, esterilizado: e.target.checked })}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="esterilizado" className="ml-2 block text-sm text-gray-900">
                    Esterilizado/Castrado
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Microchip</label>
                  <input
                    type="text"
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.microchip}
                    onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
                    placeholder="Ej: 123456789012345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notas Especiales</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.notasEspeciales}
                    onChange={(e) => setFormData({ ...formData, notasEspeciales: e.target.value })}
                    placeholder="Comportamiento, dieta especial, medicamentos regulares, etc."
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
              >
                {editingId ? "Actualizar" : "Guardar"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelForm}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{getSpeciesEmoji(pet.especie)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{pet.nombre}</h3>
                    <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                      {pet.especie}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Raza:</strong> {pet.raza}</p>
                {pet.sexo && <p><strong>Sexo:</strong> {pet.sexo}</p>}
                {pet.edad !== undefined && <p><strong>Edad:</strong> {pet.edad} años</p>}
                {pet.peso && <p><strong>Peso:</strong> {pet.peso} kg</p>}
                {pet.color && <p><strong>Color:</strong> {pet.color}</p>}
                {pet.esterilizado && <p className="text-blue-600">✓ Esterilizado</p>}
                {pet.alergias && pet.alergias.length > 0 && (
                  <p className="text-red-600"><strong>Alergias:</strong> {pet.alergias.join(", ")}</p>
                )}
              </div>

              <div className="mt-4 flex justify-end space-x-2 border-t pt-4">
                <button
                  onClick={() => handleEdit(pet)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(pet._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {pets.length === 0 && !showForm && (
            <p className="text-gray-500 col-span-full text-center py-8">No tienes mascotas registradas aún.</p>
          )}
        </div>
      )}
    </div>
  );
}
