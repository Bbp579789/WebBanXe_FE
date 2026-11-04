import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface Props {
  step: number;
}

export const PaymentProgressSection: React.FC<Props> = ({ step }) => {
  const steps = [
    { number: 1, title: "Điểm giao xe & Hồ sơ" },
    { number: 2, title: "Đặt cọc trực tuyến" },
  ];

  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#b8955a] uppercase font-bold">
            ATELIER RESERVATION CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950 mt-1">
            {step === 1 ? "Điểm Giao Xe & Hồ Sơ Đứng Tên" : "Đặt Cọc Trực Tuyến"}
          </h1>
        </div>
        <p className="text-xs text-zinc-500 font-light max-w-xs text-left md:text-right">
          Xác lập thông tin chủ sở hữu và lựa chọn phương thức tiếp nhận xe.
        </p>
      </div>

      <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2">
        {steps.map((item, index) => {
          const completed = step > item.number;
          const active = step === item.number;

          return (
            <React.Fragment key={item.number}>
              {index > 0 && <div className="w-8 h-px bg-zinc-200 shrink-0" />}
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border min-w-max ${
                active ? "border-zinc-900 bg-white shadow-sm" : "border-zinc-200 bg-zinc-50/50"
              }`}>
                {completed ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : (
                  <Circle className={`size-4 ${active ? "text-zinc-900 fill-zinc-900" : "text-zinc-400"}`} />
                )}
                <div>
                  <p className="text-[10px] font-bold text-zinc-900">
                    0{item.number}. {item.title}
                  </p>
                  <p className={`text-[9px] font-medium ${
                    completed ? "text-emerald-600" : active ? "text-zinc-500" : "text-zinc-400"
                  }`}>
                    {completed ? "Đã hoàn thành" : active ? "Đang thực hiện" : "Bước tiếp theo"}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
