export async function api(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : "";

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error en la petición");
  }

  return res.json();
}
