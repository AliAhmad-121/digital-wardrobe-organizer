import React from "react";

// Main Select wrapper
export function Select({ value, onValueChange, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="border rounded-md px-3 py-2"
    >
      {children}
    </select>
  );
}

// Option item
export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

// These are just placeholders so your code doesn't break
export function SelectTrigger({ children }) {
  return children;
}

export function SelectValue() {
  return null;
}

export function SelectContent({ children }) {
  return children;
}