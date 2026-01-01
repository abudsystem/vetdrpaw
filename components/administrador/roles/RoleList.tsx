import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { RoleMobileCard } from './RoleMobileCard';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useTranslations } from 'next-intl';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface RoleListProps {
    users: User[];
    modifiedRoles: { [key: string]: string };
    onRoleChange: (userId: string, newRole: string) => void;
    onSave: (userId: string) => void;
}

export const RoleList = ({ users, modifiedRoles, onRoleChange, onSave }: RoleListProps) => {
    const t = useTranslations('AdminDashboard.roles');
    const tr = useTranslations('AdminDashboard.roleLabels');

    const {
        paginatedItems: paginatedUsers,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = usePagination(users, 10);

    if (users.length === 0) {
        return (
            <Card className="p-8 text-center text-black font-bold">
                {t('noUsers')}
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {paginatedUsers.map((user) => (
                    <RoleMobileCard
                        key={user._id}
                        user={user}
                        modifiedRole={modifiedRoles[user._id] || user.role}
                        onRoleChange={onRoleChange}
                        onSave={onSave}
                    />
                ))}
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">{t('table.user')}</TableHead>
                            <TableHead className="font-bold">{t('table.currentRole')}</TableHead>
                            <TableHead className="font-bold">{t('table.newRole')}</TableHead>
                            <TableHead className="font-bold text-right">{t('table.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-700 font-bold">{user.email}</div>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${user.role === 'administrador' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'veterinario' ? 'bg-indigo-100 text-indigo-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {tr(user.role as any)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <select
                                        value={modifiedRoles[user._id] || user.role}
                                        onChange={(e) => onRoleChange(user._id, e.target.value)}
                                        className="mt-1 block pl-3 pr-10 py-2 text-base font-bold border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border text-black"
                                    >
                                        <option value="cliente">{tr('cliente')}</option>
                                        <option value="veterinario">{tr('veterinario')}</option>
                                        <option value="administrador">{tr('administrador')}</option>
                                    </select>
                                </TableCell>
                                <TableCell className="text-right">
                                    {modifiedRoles[user._id] && modifiedRoles[user._id] !== user.role && (
                                        <Button
                                            size="sm"
                                            onClick={() => onSave(user._id)}
                                            className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold"
                                        >
                                            {t('updateRole')}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
