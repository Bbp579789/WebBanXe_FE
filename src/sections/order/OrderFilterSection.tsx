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
    { id: "all", label: "ALL CONTRACTS", count: counts.all },
    { id: "pending", label: "PENDING", count: counts.pending },
    { id: "active", label: "PROCESSING", count: counts.active },
    { id: "shipping", label: "IN TRANSIT", count: counts.shipping },
    { id: "delivered", label: "DELIVERED", count: counts.delivered },
    { id: "completed", label: "COMPLETED", count: counts.completed },
    { id: "cancelled", label: "CANCELLED", count: counts.cancelled },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setFilter(tab.id)}
          className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-200 ${
            activeFilter === tab.id
              ? "bg-zinc-950 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          {tab.label} ({tab.count ?? 0})
        </button>
      ))}
    </div>
  );
};
