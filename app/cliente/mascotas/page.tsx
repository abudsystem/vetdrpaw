"use client";

import { useState } from "react";
import { Pet } from '@/types/pet';
import { usePets } from "@/hooks/usePets";
import { PetForm } from "@/components/cliente/mascotas/PetForm";
import { PetList } from "@/components/cliente/mascotas/PetList";
import { useTranslations } from "next-intl";

export default function MyPetsPage() {
  const t = useTranslations('ClientPanel');
  const { pets, loading, savePet, deletePet } = usePets();
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handleSubmit = async (formData: any) => {
    const success = await savePet(formData, !!editingPet, editingPet?._id);
    if (success) {
      setShowForm(false);
      setEditingPet(null);
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingPet(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('pets.title')}</h1>
        <button
          onClick={() => {
            if (showForm) cancelForm();
            else setShowForm(true);
          }}
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
        >
          {showForm ? t('common.cancel') : t('pets.newPet')}
        </button>
      </div>

      {showForm && (
        <PetForm
          initialData={editingPet}
          onSubmit={handleSubmit}
          onCancel={cancelForm}
          isEditing={!!editingPet}
        />
      )}

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <PetList
          pets={pets}
          onEdit={handleEdit}
          onDelete={deletePet}
          showForm={showForm}
        />
      )}
    </div>
  );
}
