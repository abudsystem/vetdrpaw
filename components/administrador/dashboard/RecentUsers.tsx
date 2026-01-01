import React from 'react';
import { User } from '@/types/user';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { useTranslations, useLocale } from 'next-intl';
import { TableSkeleton } from '@/components/ui/Skeleton';

export const RecentUsers = ({ users, loading }: { users: User[], loading?: boolean }) => {
    const t = useTranslations('AdminDashboard.dashboard.recentRecords');
    const tr = useTranslations('AdminDashboard.roleLabels');
    const tc = useTranslations('ClientPanel.common');
    const locale = useLocale();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <TableSkeleton rows={5} cols={4} />
                ) : users.length === 0 ? (
                    <p className="text-gray-500 font-bold py-4 text-center">{t('noRecords')}</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('table.name')}</TableHead>
                                <TableHead>{t('table.email')}</TableHead>
                                <TableHead>{t('table.role')}</TableHead>
                                <TableHead>{t('table.date')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-bold text-gray-900">{user.name}</TableCell>
                                    <TableCell className="text-gray-700 font-medium">{user.email}</TableCell>
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
                                    <TableCell className="text-gray-600 font-bold">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(locale) : tc('notAvailable')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};
