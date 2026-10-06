import * as React from "react";
import { cn } from "../../lib/utils";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  children,
  side = "left",
  className = "",
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const isLeft = side === "left";
  const translateHidden = isLeft ? "-translate-x-full" : "translate-x-full";
  const translateVisible = "translate-x-0";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-[visibility] duration-500",
        isOpen ? "visible" : "invisible delay-500"
      )}
    >
      {/* Màn mờ đen phía sau */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Khung Sheet nền trắng chuẩn mẫu */}
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed top-0 bottom-0 z-50 h-full w-[310px] sm:w-[350px] bg-white p-7 shadow-2xl flex flex-col justify-between text-zinc-900",
          "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          isLeft ? "left-0" : "right-0",
          isOpen ? translateVisible : translateHidden,
          className
        )}
      >
        {children}
      </aside>
    </div>
  );
};