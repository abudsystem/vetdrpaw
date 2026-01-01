import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-300 focus-ring disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed btn-premium-hover";

        const variants = {
            primary: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-md hover:shadow-xl",
            secondary: "bg-white text-gray-900 hover:bg-gray-50 active:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md",
            danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-xl",
            success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-md hover:shadow-xl",
            outline: "border-2 border-teal-600 bg-transparent hover:bg-teal-600 hover:text-white active:bg-teal-700 text-teal-600",
            ghost: "hover:bg-gray-100 active:bg-gray-200 text-gray-700 hover:text-gray-900"
        };

        const sizes = {
            sm: "h-9 px-4 text-sm rounded-xl gap-2",
            md: "h-11 px-6 py-2 text-sm rounded-2xl gap-2",
            lg: "h-14 px-8 text-base rounded-2xl gap-3"
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                <span className="relative z-10">{children}</span>
            </button>
        );
    }
);
Button.displayName = "Button";

