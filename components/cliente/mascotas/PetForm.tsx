import React, { useState, useEffect } from 'react';
import { Pet } from '@/types/pet';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface PetFormProps {
    initialData?: Pet | null;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isEditing: boolean;
}

export const PetForm = ({ initialData, onSubmit, onCancel, isEditing }: PetFormProps) => {
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
        if (initialData) {
            setFormData({
                nombre: initialData.nombre,
                especie: initialData.especie || "Perro",
                raza: initialData.raza || "",
                edad: initialData.edad || 0,
                peso: initialData.peso || 0,
                sexo: initialData.sexo || "",
                fechaNacimiento: initialData.fechaNacimiento
                    ? new Date(initialData.fechaNacimiento).toISOString().split('T')[0]
                    : "",
                color: initialData.color || "",
                alergias: initialData.alergias || [],
                esterilizado: initialData.esterilizado || false,
                microchip: initialData.microchip || "",
                notasEspeciales: initialData.notasEspeciales || "",
            });
        }
    }, [initialData]);

    const addAlergia = () => {
        if (alergiaInput.trim()) {
            setFormData({ ...formData, alergias: [...formData.alergias, alergiaInput.trim()] });
            setAlergiaInput("");
        }
    };

    const removeAlergia = (index: number) => {
        setFormData({ ...formData, alergias: formData.alergias.filter((_, i) => i !== index) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="mb-8">
            <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-black mb-4">{isEditing ? "Editar Mascota" : "Registrar Mascota"}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información Básica */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Información Básica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Nombre *</Label>
                                <Input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Especie *</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black"
                                    value={formData.especie}
                                    onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
                                >
                                    <option value="Perro">Perro</option>
                                    <option value="Gato">Gato</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div>
                                <Label>Raza *</Label>
                                <Input
                                    type="text"
                                    required
                                    value={formData.raza}
                                    onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Sexo</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black"
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
                                <Label>Fecha de Nacimiento</Label>
                                <Input
                                    type="date"
                                    value={formData.fechaNacimiento}
                                    onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Peso (kg)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={formData.peso || ""}
                                    onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <Label>Color/Marcas</Label>
                                <Input
                                    type="text"
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
                                <Label className="mb-2">Alergias Conocidas</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        className="flex-1"
                                        value={alergiaInput}
                                        onChange={(e) => setAlergiaInput(e.target.value)}
                                        placeholder="Ej: Polen, Pollo"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAlergia())}
                                    />
                                    <Button
                                        type="button"
                                        onClick={addAlergia}
                                        className="bg-blue-500 hover:bg-blue-600"
                                    >
                                        Agregar
                                    </Button>
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
                                <Label htmlFor="esterilizado" className="ml-2">
                                    Esterilizado/Castrado
                                </Label>
                            </div>

                            <div>
                                <Label>Número de Microchip</Label>
                                <Input
                                    type="text"
                                    value={formData.microchip}
                                    onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
                                    placeholder="Ej: 123456789012345"
                                />
                            </div>

                            <div>
                                <Label>Notas Especiales</Label>
                                <textarea
                                    rows={3}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black"
                                    value={formData.notasEspeciales}
                                    onChange={(e) => setFormData({ ...formData, notasEspeciales: e.target.value })}
                                    placeholder="Comportamiento, dieta especial, medicamentos regulares, etc."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex gap-4">
                        <Button
                            type="submit"
                            className="w-full bg-teal-600 hover:bg-teal-700"
                        >
                            {isEditing ? "Actualizar" : "Guardar"}
                        </Button>
                        {isEditing && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                className="w-full"
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
