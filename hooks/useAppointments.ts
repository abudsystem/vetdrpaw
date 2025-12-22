import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchAppointments = async () => {
  const res = await fetch("/api/appointments?my_appointments=true");
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
};

const fetchAppointmentById = async (id: string) => {
  const res = await fetch(`/api/cliente/citas/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export function useAppointments() {
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/appointments?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelada" }),
      });
      if (!res.ok) throw new Error("Failed to cancel");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  return {
    appointments,
    loading: isLoading,
    error,
    cancelAppointment: cancelMutation.mutateAsync
  };
}

export function useAppointment(id: string) {
  const queryClient = useQueryClient();

  const { data: appointment, isLoading, error } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => fetchAppointmentById(id),
    enabled: !!id
  });

  const updateMutation = useMutation({
    mutationFn: async (updateData: any) => {
      const res = await fetch(`/api/cliente/citas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['appointment', id], data);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/cliente/citas/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  return {
    appointment,
    loading: isLoading,
    error,
    updateAppointment: updateMutation.mutateAsync,
    deleteAppointment: deleteMutation.mutateAsync
  };
}
