import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pet } from '@/types/pet';
import { PetServices } from '@/lib/api/pet.service';

export const usePets = () => {
    const queryClient = useQueryClient();

    const { data: pets = [], isLoading: loading, error } = useQuery({
        queryKey: ['pets'],
        queryFn: PetServices.getClientPets
    });

    const createPetMutation = useMutation({
        mutationFn: (petData: any) => PetServices.registerNewPet(petData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        },
    });

    const updatePetMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => PetServices.updatePetDetails(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        },
    });

    const deletePetMutation = useMutation({
        mutationFn: (id: string) => PetServices.removePet(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        },
    });

    const savePet = async (petData: any, isEditing: boolean, petId?: string) => {
        try {
            if (isEditing && petId) {
                await updatePetMutation.mutateAsync({ id: petId, data: petData });
            } else {
                await createPetMutation.mutateAsync(petData);
            }
            return true;
        } catch (error) {
            console.error("Error saving pet:", error);
            return false;
        }
    };

    const deletePet = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta mascota?")) return false;

        try {
            await deletePetMutation.mutateAsync(id);
            return true;
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
        refreshPets: () => queryClient.invalidateQueries({ queryKey: ['pets'] })
    };
};
