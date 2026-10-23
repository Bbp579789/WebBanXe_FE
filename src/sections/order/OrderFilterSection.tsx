import React from 'react';

interface Props {
  activeFilter: string;
  setFilter: (f: string) => void;
  counts: Record<string, number>;
}

export const OrderFilterSection: React.FC<Props> = ({ activeFilter, setFilter, counts }) => {
  const tabs = [
    { id: 'all', label: 'ALL ORDERS', count: counts.all },
    { id: 'deposit', label: 'DEPOSIT PLACED', count: counts.deposit },
    { id: 'transit', label: 'IN TRANSIT', count: counts.transit },
    { id: 'delivered', label: 'DELIVERED', count: counts.delivered },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setFilter(tab.id)}
          className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-200 ${
            activeFilter === tab.id
              ? 'bg-zinc-950 text-white'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
};