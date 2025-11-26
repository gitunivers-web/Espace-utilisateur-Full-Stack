import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-200 hover-elevate active-elevate-2 group relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border border-primary shadow-md hover:shadow-lg active:shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border shadow-md hover:shadow-lg",
        outline:
          "border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary-border shadow-md hover:shadow-lg",
        ghost: "border border-transparent hover:bg-accent/10",
        accent:
          "bg-gradient-to-r from-accent to-accent/90 text-accent-foreground shadow-md hover:shadow-lg",
        premium:
          "bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl relative overflow-hidden",
      },
      size: {
        default: "min-h-10 px-5 py-2.5",
        sm: "min-h-8 rounded-lg px-3 text-xs",
        lg: "min-h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
