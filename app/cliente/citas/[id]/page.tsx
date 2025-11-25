// app/cliente/citas/[id]/page.tsx
import AppointmentDetails from "@/components/AppointmentDetails";

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  return (
    <div>
      <h1>Detalles de la Cita</h1>
      <AppointmentDetails id={params.id} />
    </div>
  );
}
