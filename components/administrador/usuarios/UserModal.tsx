import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; email: string; role: string }) => void;
    initialData?: { name: string; email: string; role: string };
}

export const UserModal = ({ isOpen, onClose, onSave, initialData }: UserModalProps) => {
    const t = useTranslations('AdminDashboard.users.modal');
    const tr = useTranslations('AdminDashboard.roleLabels');
    const tp = useTranslations('ClientPanel.profile');
    const tc = useTranslations('ClientPanel.common');

    const [formData, setFormData] = useState({ name: "", email: "", role: "cliente" });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: "", email: "", role: "cliente" });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? t('editTitle') : t('newTitle')}
            footer={
                <>
                    <Button variant="outline" onClick={onClose} className="mr-2 font-bold">
                        {tc('cancel')}
                    </Button>
                    <Button onClick={handleSubmit} className="font-bold">
                        {tc('save')}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-black">
                    <Input
                        label={tp('fullName')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="font-bold"
                    />
                </div>
                <div className="text-black">
                    <Input
                        label={tp('email')}
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="font-bold"
                    />
                </div>
                <div className="text-black">
                    <Label htmlFor="role" className="mb-1 font-bold">{tp('role')}</Label>
                    <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="p-3 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-bold"
                    >
                        <option value="cliente">{tr('cliente')}</option>
                        <option value="veterinario">{tr('veterinario')}</option>
                        <option value="administrador">{tr('administrador')}</option>
                    </select>
                </div>
            </form>
        </Modal>
    );
};
