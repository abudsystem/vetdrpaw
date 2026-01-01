import { User } from '@/types/user';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface UserMobileCardProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
}

export const UserMobileCard = ({ user, onEdit, onDelete }: UserMobileCardProps) => {
    const tr = useTranslations('AdminDashboard.roleLabels');
    const tc = useTranslations('ClientPanel.common');

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-700 font-bold">{user.email}</p>
                </div>
                <Badge
                    variant={
                        user.role === 'administrador' ? 'info' :
                            user.role === 'veterinario' ? 'default' :
                                'success'
                    }
                >
                    {tr(user.role as any)}
                </Badge>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="text-black hover:text-black font-bold"
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
        </div>
    );
};
