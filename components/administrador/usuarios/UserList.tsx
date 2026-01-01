import React from 'react';
import { User } from '@/types/user';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card } from '@/components/ui/Card';
import { UserMobileCard } from './UserMobileCard';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useTranslations } from 'next-intl';

interface UserListProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
}

export const UserList = ({ users, onEdit, onDelete }: UserListProps) => {
    const t = useTranslations('AdminDashboard.users');
    const tr = useTranslations('AdminDashboard.roleLabels');
    const tc = useTranslations('ClientPanel.common');

    const {
        paginatedItems: paginatedUsers,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = usePagination(users, 10);

    if (users.length === 0) {
        return (
            <Card className="p-8 text-center text-gray-700 font-bold">
                {t('noUsers')}
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {paginatedUsers.map((user) => (
                    <UserMobileCard
                        key={user._id}
                        user={user}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('table.name')}</TableHead>
                            <TableHead>{t('table.email')}</TableHead>
                            <TableHead>{t('table.role')}</TableHead>
                            <TableHead>{t('table.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-gray-700 font-bold">{user.email}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.role === 'administrador' ? 'info' :
                                                user.role === 'veterinario' ? 'default' :
                                                    'success'
                                        }
                                    >
                                        {tr(user.role as any)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm font-bold">
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(user)}
                                            className="text-indigo-600 hover:text-indigo-900 font-bold"
                                        >
                                            {tc('edit')}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(user._id)}
                                            className="text-red-600 hover:text-red-900 font-bold"
                                        >
                                            {tc('delete')}
                                        </Button>
                                    </div>
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
