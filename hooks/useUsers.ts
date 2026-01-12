import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import { UserServices } from "@/services/client/user.service";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await UserServices.getAllSystemUsers();
            setUsers(data);
            setError("");
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Error de conexión al cargar usuarios");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const deleteUser = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return false;

        try {
            const success = await UserServices.deleteUserById(id);
            if (success) {
                setUsers(prev => prev.filter(u => u._id !== id));
                return true;
            } else {
                alert("Error al eliminar usuario");
                return false;
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error de conexión al eliminar usuario");
            return false;
        }
    };

    const updateUser = async (id: string, formData: { name: string; email: string; role: string }) => {
        try {
            const updatedUser = await UserServices.updateUserById(id, formData);
            setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
            return true;
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Error al actualizar usuario");
            return false;
        }
    };

    return {
        users,
        loading,
        error,
        deleteUser,
        updateUser,
        refreshUsers: fetchUsers
    };
};
