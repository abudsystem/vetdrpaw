"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackupList } from "@/components/administrador/copiainventario/BackupList";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface Backup {
    _id: string;
    filename: string;
    type: 'MANUAL' | 'DAILY' | 'WEEKLY';
    createdBy: string | { name: string };
    recordCount: number;
    fileSize: number;
    createdAt: string;
}

export default function BackupsPage() {
    const [backups, setBackups] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const t = useTranslations('AdminDashboard.inventoryBackup');

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
            console.error(t('ErrorFetchingData'), error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBackup = async () => {
        if (!confirm(t('confirmCopy'))) return;

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
                alert(t('successCopy'));
            } else {
                alert(t('errorCopy'));
            }
        } catch (error) {
            console.error(t('errorCopy'), error);
            alert(t('errorCopy'));
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("confirmDeleteBackup"))) return;

        try {
            const res = await fetch(`/api/backups/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchBackups();
            } else {
                alert(t('errorDeleteBackup'));
            }
        } catch (error) {
            console.error(t('errorDeleteBackup'), error);
            alert(t('errorDeleteBackup'));
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const filteredBackups = backups.filter(
        (backup) =>
            backup.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
            backup.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8">{t('loading')}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
                    <p className="text-gray-600 mt-1">{t('description')}</p>
                </div>
                <button
                    onClick={handleCreateBackup}
                    disabled={creating}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 w-full md:w-auto"
                >
                    <span className="text-xl">💾</span>
                    {creating ? t('span.creating') : t('span.creatManualCopy')}
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
                            <strong>{t('strong.information')}:</strong> {t('message')}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            {t('note')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-700 text-sm font-medium">{t('totalCopies')}</h3>
                    <p className="text-2xl font-bold text-gray-800">{backups.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-700 text-sm font-medium">{t('lastCopy')}</h3>
                    <p className="text-lg font-bold text-gray-800">
                        {backups.length > 0
                            ? new Date(backups[0].createdAt).toLocaleDateString()
                            : "N/A"}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <h3 className="text-gray-700 text-sm font-medium">{t('totalSize')}</h3>
                    <p className="text-lg font-bold text-gray-800">
                        {formatBytes(backups.reduce((sum, b) => sum + b.fileSize, 0))}
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('search')}
                        className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Backups Table */}
            <BackupList
                backups={filteredBackups}
                formatBytes={formatBytes}
                onDelete={handleDelete}
            />
        </div>
    );
}
