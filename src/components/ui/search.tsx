import * as React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showShortcut?: boolean;
}

export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, value, onChange, onClear, showShortcut = true, placeholder = "Tìm kiếm dòng xe, phiên bản...", ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {/* Icon Kính lúp */}
        <SearchIcon className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none stroke-[2]" />

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "h-11 w-full rounded-full border border-zinc-800 bg-zinc-900/60 pl-10 pr-12 text-xs text-white placeholder:text-zinc-500 transition-all duration-200",
            "focus-visible:outline-none focus-visible:border-[#b8955a] focus-visible:bg-black/80 focus-visible:ring-1 focus-visible:ring-[#b8955a]",
            className
          )}
          {...props}
        />

        {/* Nút Xóa nhanh hoặc Phím tắt */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {value ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Xóa tìm kiếm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            showShortcut && (
              <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-zinc-800 bg-zinc-950 px-1.5 font-mono text-[9px] font-medium text-zinc-500 select-none">
                ⌘K
              </kbd>
            )
          )}
        </div>
      </div>
    );
  }
);
Search.displayName = "Search";