"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to Sentry
        Sentry.captureException(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
            <div className="bg-red-50 p-8 rounded-full mb-6">
                <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Vaya! Algo salió mal
            </h2>
            <p className="text-gray-600 max-w-md mb-8">
                Ha ocurrido un error inesperado. Hemos sido notificados y estamos trabajando en ello.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} className="bg-teal-600 hover:bg-teal-700">
                    Intentar de nuevo
                </Button>
                <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                    Recargar página
                </Button>
            </div>
        </div>
    );
}
