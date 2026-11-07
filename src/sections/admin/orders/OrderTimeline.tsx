
import React from "react";
import { Check } from "lucide-react";

type TimelineStep = 1 | 2 | 3 | 4;

interface Props {
  selectedStep: TimelineStep;
  onStepChange: (step: TimelineStep) => void;
}

const timelineSteps = [
  { step: 1, label: "Đặt cọc" },
  { step: 2, label: "Ký HĐ & Đóng tiền" },
  { step: 3, label: "Đang giao" },
  { step: 4, label: "Bàn giao chìa khóa" },
] as const;

const OrderTimeline: React.FC<Props> = ({
  selectedStep,
  onStepChange,
}) => {
  return (
    <div className="border border-zinc-100 rounded-2xl p-5 bg-white shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
          Tiến Trình Bàn Giao Xe
        </h3>

        <span className="text-xs text-[#b8955a] font-bold">
          Bước {selectedStep}/4
        </span>
      </div>

      <div className="relative flex items-center justify-between">
        <div className="absolute left-6 right-6 top-4 h-[2px] bg-zinc-200" />

        <div
          className="absolute left-6 top-4 h-[2px] bg-[#b8955a] transition-all duration-500"
          style={{
            width: `${((selectedStep - 1) / 3) * 85}%`,
          }}
        />

        {timelineSteps.map((item) => {
          const isPassed = item.step <= selectedStep;
          const isCurrent = item.step === selectedStep;

          return (
            <button
              key={item.step}
              type="button"
              onClick={() =>
                onStepChange(item.step as TimelineStep)
              }
              className="flex flex-col items-center group relative z-10 focus:outline-none cursor-pointer"
            >
              <div
                className={`size-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCurrent
                    ? "bg-zinc-950 text-[#b8955a] ring-4 ring-[#b8955a]/20 shadow-md"
                    : isPassed
                    ? "bg-[#b8955a] text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                }`}
              >
                {isPassed && !isCurrent ? (
                  <Check className="size-4" />
                ) : (
                  item.step
                )}
              </div>

              <span
                className={`mt-2 text-[11px] font-medium text-center max-w-[90px] leading-tight ${
                  isCurrent
                    ? "text-zinc-900 font-bold"
                    : isPassed
                    ? "text-zinc-700"
                    : "text-zinc-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
