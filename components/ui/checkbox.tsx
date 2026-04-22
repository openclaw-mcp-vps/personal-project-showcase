import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
};

export function Checkbox({ checked, onChange, className, id, disabled }: CheckboxProps) {
  return (
    <button
      type="button"
      id={id}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex h-5 w-5 items-center justify-center rounded border border-[#30363d] bg-[#0d1117] text-[#0d1117] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff] disabled:opacity-50",
        checked && "bg-[#238636] text-white",
        className
      )}
      aria-pressed={checked}
      aria-label="Select repository"
    >
      <Check className={cn("h-3.5 w-3.5", !checked && "opacity-0")} />
    </button>
  );
}
