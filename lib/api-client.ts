export async function apiClient<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(endpoint, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error en la petición');
    }

    return response.json();
}
