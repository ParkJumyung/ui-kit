"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import Button from "../Button/Button";

const variantsConfig = {
  size: {
    small: "",
    big: "",
  },
  divider: {
    on: "divide-solid divide-greyBorder divide-x-2",
    off: "",
  },
};

const variants = cva("inline-flex rounded-md shadow-sm overflow-clip", {
  variants: variantsConfig,
  defaultVariants: {
    size: "small",
    divider: "on",
  },
});

export interface SelectProps
  extends Omit<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      "onChange" | "size"
    >,
    VariantProps<typeof variants> {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, divider, value, options, onChange, ...props }, ref) => {
    return (
      <div>
        <select
          value={value}
          className="hidden"
          ref={ref}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div
          className={cn(variants({ size, divider, className }))}
          role="group"
        >
          {options.map((option) => (
            <div key={option}>
              <Button
                variant={option === value ? "fill" : "sub"}
                size={size}
                onClick={() => onChange(option)}
                className={`rounded-none active:scale-100 border-none`}
              >
                {option}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export default Select;
export { variantsConfig };
