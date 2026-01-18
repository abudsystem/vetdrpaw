"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { FallbackProps } from "react-error-boundary";

export function GlobalErrorBoundary({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Algo salió mal
            </h2>

            <p className="text-gray-600 max-w-md mb-8">
                Ha ocurrido un error inesperado. Hemos sido notificados y estamos trabajando en ello.
            </p>

            {process.env.NODE_ENV === 'development' && error instanceof Error && (
                <div className="w-full max-w-2xl bg-gray-50 p-4 rounded-lg mb-8 overflow-auto text-left">
                    <p className="text-sm font-mono text-red-600 break-all">
                        {error.message}
                    </p>
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Ir al Inicio
                </button>

                <button
                    onClick={resetErrorBoundary}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Intentar de nuevo
                </button>
            </div>
        </div>
    );
}
