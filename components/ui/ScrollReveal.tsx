"use client";

import React, { ReactNode } from "react";
import useOnScreen from "@/hooks/useOnScreen";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    threshold?: number;
    width?: "full" | "fit";
    delay?: number; // Delay in ms
    onVisible?: () => void; // Callback when element becomes visible
}

export const ScrollReveal = ({
    children,
    className = "",
    threshold = 0.1,
    width = "full",
    delay = 0,
    onVisible,
}: ScrollRevealProps) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold }, true);

    // Trigger callback if provided
    React.useEffect(() => {
        if (isVisible && onVisible) {
            onVisible();
        }
    }, [isVisible, onVisible]);

    const style = {
        transitionDelay: `${delay}ms`,
    };

    return (
        <div
            ref={ref}
            style={style}
            className={`
        transition-all duration-1000 ease-out transform
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        ${width === "full" ? "w-full" : "w-fit"}
        ${className}
        print:opacity-100 print:translate-y-0
      `}
        >
            {children}
        </div>
    );
};
