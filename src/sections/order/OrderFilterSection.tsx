
import React from "react";

interface Props {
  activeFilter: string;
  setFilter: (filter: string) => void;
  counts: Record<string, number>;
}

export const OrderFilterSection: React.FC<Props> = ({
  activeFilter,
  setFilter,
  counts,
}) => {
  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xác nhận" },
    { id: "active", label: "Đang xử lý" },
    { id: "shipping", label: "Đang giao" },
    { id: "completed", label: "Hoàn tất" },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex flex-wrap items-center gap-2.5">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          const count = counts[tab.id] ?? 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`
                min-h-[42px]
                px-5 py-2.5
                rounded-full
                inline-flex items-center justify-center gap-2
                text-[11px]
                font-semibold
                tracking-wide
                whitespace-nowrap
                font-sans
                transition-all duration-300
                border
                ${
                  isActive
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-[#b8955a] hover:text-[#a9854c]"
                }
              `}
            >
              <span>{tab.label}</span>

              <span
                className={`
                  min-w-[21px] h-[21px]
                  px-1.5
                  rounded-full
                  inline-flex items-center justify-center
                  text-[10px]
                  font-semibold
                  tabular-nums
                  ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-zinc-100 text-zinc-500"
                  }
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};