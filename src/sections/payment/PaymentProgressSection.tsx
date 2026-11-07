
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
    <div className="w-full min-w-0 pt-6 sm:pt-8 mb-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="min-w-0">
          <span className="text-[11px] font-sans tracking-[0.2em] text-[#b8955a] uppercase font-bold">
            ATELIER RESERVATION CHECKOUT
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-zinc-950 mt-2 leading-tight">
            {step === 1
              ? "Điểm Giao Xe & Hồ Sơ Đứng Tên"
              : "Đặt Cọc Trực Tuyến"}
          </h1>
        </div>

        <p className="text-xs font-sans text-zinc-500 font-normal max-w-xs text-left md:text-right leading-relaxed">
          Xác lập thông tin chủ sở hữu và lựa chọn phương thức tiếp nhận xe.
        </p>
      </div>

      {/* Thanh tiến trình */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto overflow-y-hidden pb-3 w-full">
        {steps.map((item, index) => {
          const completed = step > item.number;
          const active = step === item.number;

          return (
            <React.Fragment key={item.number}>
              {index > 0 && (
                <div className="w-8 h-px bg-zinc-200 shrink-0" />
              )}

              <div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border min-w-max shrink-0 font-sans ${
                  active
                    ? "border-zinc-900 bg-white shadow-sm"
                    : "border-zinc-200 bg-zinc-50/50"
                }`}
              >
                {completed ? (
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle
                    className={`size-4 shrink-0 ${
                      active
                        ? "text-zinc-900 fill-zinc-900"
                        : "text-zinc-400"
                    }`}
                  />
                )}

                <div>
                  <p className="text-[10px] font-bold font-sans text-zinc-900">
                    0{item.number}. {item.title}
                  </p>

                  <p
                    className={`text-[9px] font-medium font-sans ${
                      completed
                        ? "text-emerald-600"
                        : active
                          ? "text-zinc-500"
                          : "text-zinc-400"
                    }`}
                  >
                    {completed
                      ? "Đã hoàn thành"
                      : active
                        ? "Đang thực hiện"
                        : "Bước tiếp theo"}
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
