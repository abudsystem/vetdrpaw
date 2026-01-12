import { useState, useEffect, useCallback } from 'react';
import { Pet } from '@/types/pet';
import { PetServices } from "@/services/client/pet.service";

export const usePets = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await PetServices.getClientPets();
            setPets(data);
        } catch (error) {
            console.error("Error fetching pets:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    const savePet = async (petData: any, isEditing: boolean, petId?: string) => {
        try {
            let success;
            if (isEditing && petId) {
                success = await PetServices.updatePetDetails(petId, petData);
            } else {
                success = await PetServices.registerNewPet(petData);
            }

            if (success) {
                fetchPets();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error saving pet:", error);
            return false;
        }
    };

    const deletePet = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta mascota?")) return false;

        try {
            const success = await PetServices.removePet(id);

            if (success) {
                setPets(prev => prev.filter(p => p._id !== id));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error deleting pet:", error);
            return false;
        }
    };

    return {
        pets,
        loading,
        savePet,
        deletePet,
        refreshPets: fetchPets
    };
};
