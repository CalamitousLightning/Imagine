import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-muted text-muted-foreground",
        outline: "text-foreground border-border",
        // request_status-aligned variants (admin section 25)
        new: "border-transparent bg-admin-cyan/15 text-admin-cyan",
        reviewing: "border-transparent bg-admin-amber/15 text-admin-amber",
        in_progress: "border-transparent bg-admin-violet/15 text-admin-violet",
        completed: "border-transparent bg-admin-green/15 text-admin-green",
        cancelled: "border-transparent bg-red-500/15 text-red-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
