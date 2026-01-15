"use client";

import { useState } from "react";
import { X, UserPlus, Mail, Phone, User, Loader2, CheckCircle, PawPrint } from "lucide-react";
import { PetRegistrationForm } from "./PetRegistrationForm";
import { useTranslations } from "next-intl";

interface GuestUserFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function GuestUserForm({ onClose, onSuccess }: GuestUserFormProps) {
    const t = useTranslations('VetPanel.guestRegistration');
    const tp = useTranslations('ClientPanel.profile');
    const tc = useTranslations('ClientPanel.common');

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        telefono: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [createdUser, setCreatedUser] = useState<{ id: string; name: string } | null>(null);
    const [showPetForm, setShowPetForm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/veterinario/guest-users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || t('errorCreating'));
            }

            setSuccess(true);
            setCreatedUser({
                id: data.user._id,
                name: data.user.name,
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAddPet = () => {
        setShowPetForm(true);
    };

    const handleFinish = () => {
        onSuccess();
        onClose();
    };

    // Show pet registration form
    if (showPetForm && createdUser) {
        return (
            <PetRegistrationForm
                ownerId={createdUser.id}
                ownerName={createdUser.name}
                onClose={onClose}
                onSuccess={onSuccess}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative">
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
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                            <UserPlus className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {t('title')}
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm font-bold">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Success Message with Actions */}
                {success && createdUser && (
                    <div className="mb-4 space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                            <CheckCircle className="text-green-600" size={20} />
                            <div>
                                <p className="text-green-800 font-bold">{t('success')}</p>
                                <p className="text-green-700 text-sm font-bold">
                                    {t('emailSent', { email: formData.email })}
                                </p>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 font-bold mb-3">{t('nextSteps')}</p>
                            <div className="space-y-2">
                                <button
                                    onClick={handleAddPet}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-bold flex items-center justify-center gap-2 shadow-md"
                                >
                                    <PawPrint size={20} />
                                    {t('addPet')}
                                </button>
                                <button
                                    onClick={handleFinish}
                                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-bold"
                                >
                                    {t('finish')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm font-bold">{error}</p>
                    </div>
                )}

                {/* Form - Only show if not successful */}
                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {tp('fullName')} *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="Ej: Juan Pérez"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {tp('email')} *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="ejemplo@correo.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="text-black">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {tp('phone')} ({tc('optional')})
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="Ej: +1234567890"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-bold"
                                disabled={loading}
                            >
                                {tc('cancel')}
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        {tc('creating')}...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={20} />
                                        {t('createUser')}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
