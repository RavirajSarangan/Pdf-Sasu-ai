"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "subtle" | "pill";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        "bg-neutral-950 text-white font-semibold hover:bg-neutral-800 active:scale-[0.98] shadow-sm shadow-black/10 border border-neutral-900",
      secondary:
        "bg-blue-600 text-white font-semibold hover:bg-blue-500 active:scale-[0.98] shadow-md shadow-blue-500/25 border border-blue-400/30",
      outline:
        "border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 active:scale-[0.98] shadow-xs",
      ghost:
        "bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 active:scale-[0.98]",
      danger:
        "bg-red-600 text-white font-semibold hover:bg-red-500 active:scale-[0.98] shadow-sm shadow-red-500/20",
      subtle:
        "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:scale-[0.98]",
      pill:
        "bg-blue-500/10 text-blue-600 border border-blue-500/20 hover:bg-blue-500/20 rounded-full font-semibold",
    };

    const sizes = {
      xs: "h-7 px-2.5 text-xs rounded-lg",
      sm: "h-8 px-3.5 text-xs rounded-xl",
      md: "h-9.5 px-4 text-xs font-medium rounded-xl",
      lg: "h-11 px-6 text-sm font-semibold rounded-2xl",
      icon: "h-9 w-9 p-0 flex items-center justify-center rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
