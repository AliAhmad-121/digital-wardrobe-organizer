import React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  success: "btn-success",
  danger: "btn-danger",
  warning: "btn-warning",
};

const buttonSizes = {
  sm: "text-sm py-2 px-3",
  md: "text-sm py-2.5 px-4",
  lg: "text-base py-3 px-6",
  icon: "p-2.5",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        buttonVariants[variant] || buttonVariants.primary,
        buttonSizes[size] || buttonSizes.md,
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}