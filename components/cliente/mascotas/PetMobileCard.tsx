import { Pet } from '@/types/pet';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { calculateAge } from '@/lib/dateUtils';

interface PetMobileCardProps {
    pet: Pet;
    onEdit: (pet: Pet) => void;
    onDelete: (id: string) => void;
}

export const PetMobileCard = ({ pet, onEdit, onDelete }: PetMobileCardProps) => {
    const t = useTranslations('ClientPanel.pets');
    const tc = useTranslations('ClientPanel.common');


    const sexoLabel = {
        macho: t('sexoLabel.macho'),
        hembra: t('sexoLabel.hembra'),
    } as const;

    type SexoKey = keyof typeof sexoLabel;

    const isSexo = (value: unknown): value is SexoKey => {
        return typeof value === 'string' && value in sexoLabel;
    };

    const getSpeciesEmoji = (especie: string) => {
        const especieLower = especie.toLowerCase();
        if (especieLower.includes('perro')) return '🐕';
        if (especieLower.includes('gato')) return '🐈';
        return '🐾';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
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
                <p><strong>{t('form.breed')}:</strong> {pet.raza}</p>
                {isSexo(pet.sexo) && (
                    <p>
                        <strong>{t('form.sex')}:</strong>{" "}
                        <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                            {sexoLabel[pet.sexo]}
                        </span>
                    </p>
                )}

                {pet.edad !== undefined && (
                    <p><strong>{t('table.age')}:</strong> {calculateAge(pet.fechaNacimiento, pet.edad, tc)}</p>
                )}
                {pet.peso && <p><strong>{t('form.weight')}:</strong> {pet.peso} kg</p>}
                {pet.color && <p><strong>{t('form.color')}:</strong> {pet.color}</p>}
                {pet.esterilizado && <p className="text-blue-600">✓ {t('table.sterilized')}</p>}
                {pet.alergias && pet.alergias.length > 0 && (
                    <p className="text-red-600"><strong>{t('form.allergies')}:</strong> {pet.alergias.join(", ")}</p>
                )}
            </div>

            <div className="mt-4 flex justify-end space-x-2 border-t pt-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(pet)}
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    {tc('edit')}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(pet._id)}
                    className="text-red-600 hover:text-red-800"
                >
                    {tc('delete')}
                </Button>
            </div>
        </div>
    );
};
