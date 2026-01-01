import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface GalleryImage {
    _id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
}

interface GalleryMobileCardProps {
    image: GalleryImage;
    onDelete: (id: string) => void;
}

export const GalleryMobileCard = ({ image, onDelete }: GalleryMobileCardProps) => {
    const tc = useTranslations('ClientPanel.common');

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-start gap-4 mb-3">
                <Image
                    src={image.imageUrl}
                    alt={image.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-cover rounded-md border text-xs"
                />
                <div>
                    <h3 className="font-bold text-gray-900">{image.title}</h3>
                    <p className="text-xs text-gray-700 mt-1 font-bold">
                        {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(image._id)}
                    className="text-red-600 hover:text-red-800 w-full justify-center font-bold"
                >
                    {tc('delete')}
                </Button>
            </div>
        </div>
    );
};
