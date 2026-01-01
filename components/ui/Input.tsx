import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    multiline?: boolean;
    rows?: number;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
    ({ className = '', label, error, icon, id, multiline, rows = 3, ...props }, ref) => {
        const baseClasses = `block w-full rounded-2xl border ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-100 focus:border-teal-500 focus:ring-teal-500/20 shadow-sm'
            } bg-gray-50/50 px-4 text-gray-900 placeholder:text-gray-400 font-bold focus:outline-none focus:ring-4 focus:ring-offset-0 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed sm:text-sm ${icon ? 'pl-12' : ''
            } ${className}`;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={id} className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300">
                            {icon}
                        </div>
                    )}
                    {multiline ? (
                        <textarea
                            ref={ref as any}
                            id={id}
                            rows={rows}
                            className={`${baseClasses} py-3`}
                            {...props as any}
                        />
                    ) : (
                        <input
                            ref={ref as any}
                            id={id}
                            className={`${baseClasses} h-12`}
                            {...props as any}
                        />
                    )}
                </div>
                {error && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

