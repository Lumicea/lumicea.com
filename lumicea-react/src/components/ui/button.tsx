// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
// import { Link } from "react-router-dom"; // REMOVED: Link is now passed via 'as' prop

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Add your Lumicea specific variants here if you have them, e.g.:
        "lumicea-button-primary": "bg-lumicea-gold text-lumicea-navy hover:bg-lumicea-gold-light shadow-lg",
        "lumicea-button-secondary": "bg-lumicea-navy text-lumicea-gold hover:bg-lumicea-navy-light shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  // asLink?: boolean; // REMOVED: Replaced by the more generic 'as' prop
  as?: React.ElementType; // ADDED: Allows specifying the component to render as
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, as, ...props }, ref) => { // ADDED 'as' to destructured props
    // Determines the component to render
    // 1. If 'as' prop is provided, use that component (e.g., Link)
    // 2. If 'asChild' is true, use Radix UI's Slot
    // 3. Otherwise, default to a standard HTML button
    const Comp = as || (asChild ? Slot : "button"); // MODIFIED: Logic to use 'as' prop

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };