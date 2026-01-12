import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserServices } from "@/services/client/user.service";

interface ProfileData {
    _id: string;
    name: string;
    email: string;
    role: string;
    telefono: string;
    direccion: string;
}

export const useProfile = () => {
    const router = useRouter();
    const [profile, setProfile] = useState<ProfileData>({
        _id: "",
        name: "",
        email: "",
        role: "",
        telefono: "",
        direccion: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProfile = useCallback(async () => {
        try {
            // Using generic getter for basic reuse, but could be specific depending on page context if passed prop
            const data = await UserServices.getCurrentUserProfile();
            setProfile(data);
            setError("");
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                router.push("/login");
                return;
            }
            console.error("Error fetching profile:", error);
            setError("No se pudo cargar la información del perfil. Intenta refrescar la página.");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        error,
        refreshProfile: fetchProfile
    };
};
