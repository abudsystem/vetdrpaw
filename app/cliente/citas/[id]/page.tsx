import AppointmentDetails from "@/components/AppointmentDetails";
import { useTranslations } from 'next-intl';

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  const t = useTranslations('AppointmentDetails');
  return (
    <div>
      <h1>{t('title')}</h1>
      <AppointmentDetails id={params.id} />
    </div>
  );
}
