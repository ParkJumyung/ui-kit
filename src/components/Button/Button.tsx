import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const variantsConfig = {
  variant: {
    fill: "bg-primary text-white",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
    sub: "bg-greyLight text-text border border-greyBorder",
  },
  size: {
    small: "px-4 py-2 text-sm font-semibold rounded w-fit",
    big: "rounded-md px-6 py-3 font-semibold text-base w-fit",
    full: "rounded-xl w-full px-8 py-4 text-lg font-bold",
  },
  animate: {
    on: "active:scale-95 transition",
    off: "",
  },
};

const variants = cva(
  "inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: variantsConfig,
    defaultVariants: {
      variant: "fill",
      size: "small",
      animate: "on",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(variants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
export { variantsConfig };
