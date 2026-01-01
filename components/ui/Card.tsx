import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`glass-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] ${className}`}
            {...props as any}
        >
            {children}
        </motion.div>
    );
};

export const CardHeader = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={`px-6 py-5 border-b border-gray-100/50 bg-white/30 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardTitle = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
        <h3 className={`text-lg font-bold leading-6 text-gray-900 tracking-tight ${className}`} {...props}>
            {children}
        </h3>
    );
};

export const CardDescription = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    return (
        <p className={`mt-1 text-sm text-gray-500 font-medium ${className}`} {...props}>
            {children}
        </p>
    );
};

export const CardContent = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={`px-6 py-5 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardFooter = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={`px-6 py-4 bg-gray-50/50 border-t border-gray-100/50 flex items-center justify-between gap-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

