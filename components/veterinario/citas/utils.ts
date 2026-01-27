import { Appointment } from "./types";

/**
 * Sort appointments chronologically (oldest/soonest first)
 */
export const sortAppointmentsByDate = (appointments: Appointment[]): Appointment[] => {
    return [...appointments].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
    });
};

/**
 * Filter appointments by status and sort
 */
export const filterByStatus = (appointments: Appointment[], status: string): Appointment[] => {
    const filtered = appointments.filter((app) => app.status === status);

    // For historical tabs, newest first
    if (status === 'completado' || status === 'cancelada') {
        return filtered.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
        });
    }

    // For active tabs, chronological (puts overdue at the top)
    return sortAppointmentsByDate(filtered);
};

/**
 * Get paginated data from array
 */
export const getPaginatedData = <T>(data: T[], page: number, itemsPerPage = 10): T[] => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
};

/**
 * Calculate total number of pages
 */
export const getTotalPages = (total: number, itemsPerPage = 10): number => {
    return Math.ceil(total / itemsPerPage);
};

/**
 * Generate array of page numbers for pagination display
 */
export const getPageNumbers = (currentPage: number, totalPages: number): number[] => {
    const pages = [];
    const maxPages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return pages;
};
