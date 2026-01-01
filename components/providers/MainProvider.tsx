"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { useState } from "react";
import { GlobalErrorBoundary } from "@/components/ui/GlobalErrorBoundary";

export function MainProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data is considered fresh for 1 minute
                        staleTime: 60 * 1000,
                        // Retry failed requests 1 time
                        retry: 1,
                        // Don't refetch on window focus for now to avoid jumpiness
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <ErrorBoundary FallbackComponent={GlobalErrorBoundary}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
