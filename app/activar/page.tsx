"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

import { useTranslations } from "next-intl";

function ActivationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const t = useTranslations('Activation');

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError(t('invalidToken'));
        }
    }, [token, t]);

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 6) {
            return t('passwordLength');
        }
        if (!/(?=.*[a-z])/.test(pwd)) {
            return t('passwordLowercase');
        }
        if (!/(?=.*[A-Z])/.test(pwd)) {
            return t('passwordUppercase');
        }
        if (!/(?=.*\d)/.test(pwd)) {
            return t('passwordNumber');
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (password !== confirmPassword) {
            setError(t('passwordsMismatch'));
            return;
        }

        // Validate password strength
        const validationError = validatePassword(password);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/activate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (Array.isArray(data.errors) && data.errors.length > 0) {
                    throw new Error(data.errors[0].message);
                }

                throw new Error(data.message || t('errorDefault'));
            }


            // Store token in localStorage
            localStorage.setItem("token", data.token);

            setSuccess(true);

            // Redirect to client dashboard after 2 seconds
            setTimeout(() => {
                router.push("/cliente");
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('titleInvalid')}</h2>
                    <p className="text-gray-600">
                        {t('descriptionInvalid')}
                    </p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('titleSuccess')}</h2>
                    <p className="text-gray-600 mb-4">
                        {t('descriptionSuccess')}
                    </p>
                    <Loader2 className="mx-auto animate-spin text-purple-600" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4">
                        <Mail className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('headerTitle')}</h1>
                    <p className="text-gray-600">
                        {t('headerDescription')}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            {t('labelNewPassword')}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-black"
                                placeholder={t('placeholderNewPassword')}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-black">
                            {t('passwordRequirements')}
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            {t('labelConfirmPassword')}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-black"
                                placeholder={t('placeholderConfirmPassword')}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {t('buttonActivating')}
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                {t('buttonActivate')}
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    {t('footerProblem')}{" "}
                    <a href="/contacto" className="text-purple-600 hover:text-purple-700 font-medium">
                        {t('footerContact')}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function ActivarPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        }>
            <ActivationContent />
        </Suspense>
    );
}
