import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
// Import LinkProps from react-router-dom for conditional typing
import { LinkProps } from "react-router-dom";

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

// Define a base interface for common props regardless of `asChild`
interface ButtonBaseProps extends VariantProps<typeof buttonVariants> {
  // Any common props that apply whether it's a button or a slot
  // For example, if you had an `isLoading` prop that applies to both
}

// Define the conditional type for ButtonProps
type ButtonProps = ButtonBaseProps &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: false }) // When asChild is false or undefined, it's a button
    | (LinkProps & { asChild: true }) // When asChild is true, it accepts LinkProps
  );


// Adjust the forwardRef to handle both HTMLButtonElement and HTMLAnchorElement refs
const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        // Type assertion for ref to handle the union type correctly for the underlying element
        ref={ref as React.Ref<any>} // Cast to React.Ref<any> or be more specific like React.Ref<HTMLButtonElement | HTMLAnchorElement>
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };