"use client";

import { useState } from "react";
import { X, PawPrint, Loader2, CheckCircle, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface PetData {
    nombre: string;
    especie: string;
    raza: string;
    peso?: number;
    sexo?: "macho" | "hembra";
    fechaNacimiento?: string;
    color?: string;
    alergias?: string[];
    esterilizado?: boolean;
    microchip?: string;
    notasEspeciales?: string;
}

interface PetRegistrationFormProps {
    ownerId: string;
    ownerName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function PetRegistrationForm({
    ownerId,
    ownerName,
    onClose,
    onSuccess,
}: PetRegistrationFormProps) {
    const t = useTranslations('VetPanel.petRegistration');
    const tf = useTranslations('ClientPanel.pets.form');
    const tc = useTranslations('ClientPanel.common');

    const [formData, setFormData] = useState<PetData>({
        nombre: "",
        especie: "",
        raza: "",
        sexo: "macho",
        esterilizado: false,
        alergias: [],
    });
    const [alergiaInput, setAlergiaInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [petsCreated, setPetsCreated] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/veterinario/pets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ownerId,
                    ...formData,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || t('errorCreating'));
            }

            setPetsCreated((prev) => prev + 1);
            setShowSuccess(true);

            // Reset form for next pet
            setFormData({
                nombre: "",
                especie: "",
                raza: "",
                sexo: "macho",
                esterilizado: false,
                alergias: [],
            });

            setTimeout(() => setShowSuccess(false), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (type === "number") {
            setFormData((prev) => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const addAlergia = () => {
        if (alergiaInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                alergias: [...(prev.alergias || []), alergiaInput.trim()],
            }));
            setAlergiaInput("");
        }
    };

    const removeAlergia = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            alergias: prev.alergias?.filter((_, i) => i !== index),
        }));
    };

    const handleFinish = () => {
        onSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    disabled={loading}
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                            <PawPrint className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
                            <p className="text-sm text-gray-600 font-bold">{t('for')}: {ownerName}</p>
                        </div>
                    </div>
                    {petsCreated > 0 && (
                        <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm inline-block font-bold">
                            {t('petsAdded', { count: petsCreated })}
                        </div>
                    )}
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={20} />
                        <p className="text-green-800 font-bold">{t('success')}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm font-bold">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="md:col-span-2 text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {tf('name')} *
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder={tf('placeholders.name')}
                                disabled={loading}
                            />
                        </div>

                        {/* Especie */}
                        <div className="text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">{tf('species')} *</label>
                            <select
                                name="especie"
                                value={formData.especie}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                disabled={loading}
                            >
                                <option value="">{tc('select')}...</option>
                                <option value="Perro">{tf('placeholders.dog')}</option>
                                <option value="Gato">{tf('placeholders.cat')}</option>
                                <option value="Ave">Ave</option>
                                <option value="Conejo">Conejo</option>
                                <option value="Hamster">Hamster</option>
                                <option value="Reptil">Reptil</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        {/* Raza */}
                        <div className="text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">{tf('breed')} *</label>
                            <input
                                type="text"
                                name="raza"
                                value={formData.raza}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder={tf('placeholders.breed')}
                                disabled={loading}
                            />
                        </div>

                        {/* Sexo */}
                        <div className="text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">{tf('sex')}</label>
                            <select
                                name="sexo"
                                value={formData.sexo}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                disabled={loading}
                            >
                                <option value="macho">{tf('placeholders.male')}</option>
                                <option value="hembra">{tf('placeholders.female')}</option>
                            </select>
                        </div>

                        {/* Peso */}
                        <div className="text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">{tf('weight')} (kg)</label>
                            <input
                                type="number"
                                name="peso"
                                value={formData.peso || ""}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder={tf('placeholders.weight')}
                                disabled={loading}
                            />
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div className="text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {tf('birthDate')}
                            </label>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition font-bold"
                                disabled={loading}
                            />
                        </div>

                        {/* Color */}
                        <div className="text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">{tf('color')}</label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder={tf('placeholders.color')}
                                disabled={loading}
                            />
                        </div>

                        {/* Microchip */}
                        <div className="text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">{tf('microchip')}</label>
                            <input
                                type="text"
                                name="microchip"
                                value={formData.microchip || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder={tf('placeholders.microchip')}
                                disabled={loading}
                            />
                        </div>

                        {/* Esterilizado */}
                        <div className="flex items-center gap-2 pt-8 text-black">
                            <input
                                type="checkbox"
                                name="esterilizado"
                                checked={formData.esterilizado}
                                onChange={handleChange}
                                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                disabled={loading}
                            />
                            <label className="text-sm font-bold text-gray-700">{tf('sterilized')}</label>
                        </div>

                        {/* Alergias */}
                        <div className="md:col-span-2 text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">{tf('allergies')}</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={alergiaInput}
                                    onChange={(e) => setAlergiaInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAlergia())}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    placeholder={tf('placeholders.allergies')}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={addAlergia}
                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                    disabled={loading}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 font-bold">
                                {formData.alergias?.map((alergia, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {alergia}
                                        <button
                                            type="button"
                                            onClick={() => removeAlergia(index)}
                                            className="hover:text-red-900"
                                            disabled={loading}
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Notas Especiales */}
                        <div className="md:col-span-2 text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {tf('notes')}
                            </label>
                            <textarea
                                name="notasEspeciales"
                                value={formData.notasEspeciales || ""}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                                placeholder={tf('placeholders.notes')}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleFinish}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-bold"
                            disabled={loading}
                        >
                            {petsCreated > 0 ? t('finish') : tc('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    {tc('saving')}...
                                </>
                            ) : (
                                <>
                                    <PawPrint size={20} />
                                    {petsCreated > 0 ? t('addAnother') : t('savePet')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
