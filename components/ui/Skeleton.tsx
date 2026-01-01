import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = ({ className = '', variant = 'text' }: SkeletonProps) => {
    const baseClasses = "animate-skeleton bg-gray-200 rounded";

    let variantClasses = "";
    switch (variant) {
        case 'circular':
            variantClasses = "rounded-full";
            break;
        case 'rectangular':
            variantClasses = "rounded-md";
            break;
        default:
            variantClasses = "h-4 w-full";
    }

    return (
        <div className={`${baseClasses} ${variantClasses} ${className}`} />
    );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
    return (
        <div className="w-full space-y-4">
            <div className="flex gap-4 mb-4">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} className="h-10 flex-1" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    {Array.from({ length: cols }).map((_, j) => (
                        <Skeleton key={j} className="h-12 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4 ${className}`}>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="pt-4">
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
    );
};
