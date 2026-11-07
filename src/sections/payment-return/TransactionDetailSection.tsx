
import React from "react";

interface Props {
  label: string;
  value: string;
  highlight?: boolean;
}

export const TransactionDetailSection: React.FC<Props> = ({
  label,
  value,
  highlight = false,
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-zinc-500 uppercase tracking-wide font-bold">
        {label}
      </span>

      <span
        className={`text-xs font-mono font-bold text-right max-w-[55%] truncate ${
          highlight ? "text-[#b8955a]" : "text-zinc-300"
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
};
