"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Backup {
    _id: string;
    filename: string;
    type: 'MANUAL' | 'DAILY' | 'WEEKLY';
    createdBy: string;
    recordCount: number;
    fileSize: number;
    createdAt: string;
}

export default function BackupsPage() {
    const [backups, setBackups] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchBackups();
    }, []);

    const fetchBackups = async () => {
        try {
            const res = await fetch("/api/backups");
            if (res.ok) {
                const data = await res.json();
                setBackups(data);
            }
        } catch (error) {
            console.error("Error fetching backups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBackup = async () => {
        if (!confirm("¿Crear una copia de seguridad del inventario?")) return;

        setCreating(true);
        try {
            const res = await fetch("/api/backups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ createdBy: "Administrador" }), // In production, use actual user
            });

            if (res.ok) {
                const data = await res.json();

                // Download the CSV file
                const blob = new Blob([data.csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = data.filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                fetchBackups();
                alert("Copia de seguridad creada y descargada exitosamente");
            } else {
                alert("Error al crear la copia de seguridad");
            }
        } catch (error) {
            console.error("Error creating backup:", error);
            alert("Error al crear la copia de seguridad");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta copia de seguridad?")) return;

        try {
            const res = await fetch(`/api/backups/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchBackups();
            } else {
                alert("Error al eliminar la copia");
            }
        } catch (error) {
            console.error("Error deleting backup:", error);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (loading) return <div className="p-8">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Copias de Inventario</h1>
                    <p className="text-gray-600 mt-1">Gestión de backups y copias de seguridad</p>
                </div>
                <button
                    onClick={handleCreateBackup}
                    disabled={creating}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 w-full md:w-auto"
                >
                    <span className="text-xl">💾</span>
                    {creating ? "Creando..." : "Crear Copia Manual"}
                </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>Información:</strong> Las copias se generan en formato CSV con todos los productos del inventario.
                            La copia se descarga automáticamente al crearla.
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            💡 Nota: Las copias automáticas (diarias/semanales) están planeadas para una futura actualización.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium">Total de Copias</h3>
                    <p className="text-2xl font-bold text-gray-800">{backups.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium">Última Copia</h3>
                    <p className="text-lg font-bold text-gray-800">
                        {backups.length > 0
                            ? new Date(backups[0].createdAt).toLocaleDateString()
                            : "N/A"}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-medium">Tamaño Total</h3>
                    <p className="text-lg font-bold text-gray-800">
                        {formatBytes(backups.reduce((sum, b) => sum + b.fileSize, 0))}
                    </p>
                </div>
            </div>

            {/* Backups Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archivo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado Por</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registros</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {backups.map((backup) => (
                            <tr key={backup._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{backup.filename}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${backup.type === 'MANUAL'
                                        ? 'bg-blue-100 text-blue-800'
                                        : backup.type === 'DAILY'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-purple-100 text-purple-800'
                                        }`}>
                                        {backup.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(backup.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {backup.createdBy}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {backup.recordCount} productos
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatBytes(backup.fileSize)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(backup._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {backups.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No hay copias de seguridad. Crea tu primera copia usando el botón superior.
                    </div>
                )}
            </div>
        </div>
    );
}
