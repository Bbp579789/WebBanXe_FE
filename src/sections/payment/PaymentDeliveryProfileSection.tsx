import React from "react";
import { Building2, Home } from "lucide-react";

export type DeliveryMethod = "atelier" | "home";

export interface PaymentProfile {
  fullName: string;
  phone: string;
  email: string;
  homeAddress: string;
}

interface Props {
  profile: PaymentProfile;
  onProfileChange: (field: keyof PaymentProfile, value: string) => void;
  deliveryMethod: DeliveryMethod;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  errors?: Partial<Record<keyof PaymentProfile, string>>;
}

export const PaymentDeliveryProfileSection: React.FC<Props> = ({
  profile,
  onProfileChange,
  deliveryMethod,
  onDeliveryMethodChange,
  errors = {},
}) => {
  const inputClass =
    "w-full h-11 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-400 focus:bg-white transition";
  const labelClass =
    "text-[10px] font-bold text-zinc-800 uppercase tracking-wider";

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-2 py-1 bg-zinc-100 text-[10px] font-mono font-bold text-zinc-800 rounded">
            MỤC 01 / 02
          </span>
          <span className="text-[11px] font-mono text-[#b8955a] font-bold uppercase tracking-widest">
            Pháp lý sở hữu
          </span>
        </div>

        <h2 className="text-xl font-serif font-bold text-zinc-950 mb-1">
          1. Thông Tin Hồ Sơ Đứng Tên Xe
        </h2>
        <p className="text-xs text-zinc-500 mb-6">
          Thông tin liên hệ chính thức để đăng ký hồ sơ và xuất hóa đơn GTGT.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {([
            ["fullName", "Họ và tên chủ xe *", "Nhập họ và tên...", "text"],
            ["phone", "Số điện thoại *", "Nhập số điện thoại...", "tel"],
            ["email", "Email nhận hợp đồng *", "Nhập email...", "email"],
          ] as const).map(([field, label, placeholder, type]) => (
            <div className="space-y-1.5" key={field}>
              <label className={labelClass}>{label}</label>
              <input
                type={type}
                value={profile[field]}
                onChange={(e) => onProfileChange(field, e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
              {errors[field] && (
                <p className="text-xs text-red-600">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-2 py-1 bg-zinc-100 text-[10px] font-mono font-bold text-zinc-800 rounded">
            MỤC 02 / 02
          </span>
          <span className="text-[11px] font-mono text-[#b8955a] font-bold uppercase tracking-widest">
            Nghi thức bàn giao
          </span>
        </div>

        <h2 className="text-xl font-serif font-bold text-zinc-950 mb-1">
          2. Phương Thức Tiếp Nhận Xe
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <button
            type="button"
            aria-pressed={deliveryMethod === "atelier"}
            onClick={() => onDeliveryMethodChange("atelier")}
            className={`text-left p-5 rounded-2xl border-2 relative transition-all duration-200 ${
              deliveryMethod === "atelier"
                ? "border-zinc-900 bg-white shadow-sm"
                : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-400"
            }`}
          >
            <span className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded ${
              deliveryMethod === "atelier"
                ? "text-emerald-700 bg-emerald-100"
                : "text-zinc-500 bg-zinc-200/60"
            }`}>
              Miễn phí
            </span>
            <Building2 className={`size-6 mb-3 ${deliveryMethod === "atelier" ? "text-zinc-900" : "text-zinc-400"}`} />
            <h3 className="text-sm font-bold text-zinc-900">
              Bàn giao tại Atelier Lounge
            </h3>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Nhận xe tại đại lý trong không gian riêng tư.
            </p>
          </button>

          <button
            type="button"
            aria-pressed={deliveryMethod === "home"}
            onClick={() => onDeliveryMethodChange("home")}
            className={`text-left p-5 rounded-2xl border-2 relative transition-all duration-200 ${
              deliveryMethod === "home"
                ? "border-zinc-900 bg-white shadow-sm"
                : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-400"
            }`}
          >
            <span className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded ${
              deliveryMethod === "home"
                ? "text-[#b8955a] bg-[#b8955a]/10"
                : "text-zinc-500 bg-zinc-200/60"
            }`}>
              +3.000.000 đ
            </span>
            <Home className={`size-6 mb-3 ${deliveryMethod === "home" ? "text-zinc-900" : "text-zinc-400"}`} />
            <h3 className="text-sm font-bold text-zinc-900">
              Bàn giao tận tư gia
            </h3>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Vận chuyển xe chuyên dụng và bàn giao tại địa chỉ của bạn.
            </p>
          </button>
        </div>

        {deliveryMethod === "home" && (
          <div className="mt-5 space-y-1.5">
            <label className={labelClass}>Địa chỉ nhận xe *</label>
            <textarea
              value={profile.homeAddress}
              onChange={(e) => onProfileChange("homeAddress", e.target.value)}
              rows={3}
              placeholder="Nhập số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition resize-y"
            />
            {errors.homeAddress && (
              <p className="text-xs text-red-600">{errors.homeAddress}</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
