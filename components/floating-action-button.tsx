"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const fabVariants = cva(
  "fixed z-50 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] shadow-lg hover:shadow-xl active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "h-14 w-14 md:h-12 md:w-12",
        sm: "h-12 w-12 md:h-10 md:w-10",
        lg: "h-16 w-16 md:h-14 md:w-14",
      },
      position: {
        "bottom-right": "bottom-4 right-4 md:bottom-6 md:right-6",
        "bottom-left": "bottom-4 left-4 md:bottom-6 md:left-6",
        "top-right": "top-4 right-4 md:top-6 md:right-6",
        "top-left": "top-4 left-4 md:top-6 md:left-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right",
    },
  }
);

interface FloatingActionButtonProps extends React.ComponentProps<"button">, VariantProps<typeof fabVariants> {
  children: React.ReactNode;
}

function FloatingActionButton({ className, variant, size, position, children, ...props }: FloatingActionButtonProps) {
  return (
    <button className={cn(fabVariants({ variant, size, position, className }))} {...props}>
      {children}
    </button>
  );
}

export { fabVariants, FloatingActionButton };
