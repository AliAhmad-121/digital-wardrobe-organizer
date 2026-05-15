import React from "react";
import { cn } from "../../lib/utils";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={cn("input-premium", className)}
      {...props}
    />
  );
}