import { FileText, Mail, Phone, User } from "lucide-react";
import type { CustomerForm, FormErrors } from "../../types/checkout";

interface Props {
  form: CustomerForm;
  errors: FormErrors;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const CustomerInfoSection = ({ form, errors, onChange }: Props) => {
  const inputClass = (hasError?: boolean) =>
    `w-full h-12 px-4 rounded-xl bg-zinc-800/60 border text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-1 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-zinc-700 focus:border-[#b8955a] focus:ring-[#b8955a]"
    }`;

  return (
    <section className="rounded-3xl border border-zinc-800/60 bg-zinc-900/40 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-2.5 py-1 bg-zinc-800 text-[10px] font-mono font-bold text-zinc-300 rounded">02</span>
        <span className="text-[11px] font-mono text-[#b8955a] font-bold uppercase tracking-widest">Thông tin khách hàng</span>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            <User className="size-3.5" /> Họ và tên <span className="text-red-400">*</span>
          </label>
          <input name="customer_name" value={form.customer_name} onChange={onChange} placeholder="Nguyễn Văn A" className={inputClass(!!errors.customer_name)} />
          {errors.customer_name && <p className="text-[11px] text-red-400 mt-1.5">{errors.customer_name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <Phone className="size-3.5" /> Số điện thoại <span className="text-red-400">*</span>
            </label>
            <input type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="0912 345 678" className={inputClass(!!errors.phone)} />
            {errors.phone && <p className="text-[11px] text-red-400 mt-1.5">{errors.phone}</p>}
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <Mail className="size-3.5" /> Email <span className="text-red-400">*</span>
            </label>
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="email@example.com" className={inputClass(!!errors.email)} />
            {errors.email && <p className="text-[11px] text-red-400 mt-1.5">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            <FileText className="size-3.5" /> Ghi chú <span className="text-zinc-600">(không bắt buộc)</span>
          </label>
          <textarea name="note" value={form.note} onChange={onChange} placeholder="Yêu cầu đặc biệt, thời gian nhận xe mong muốn..." rows={3} className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700 text-sm text-white placeholder-zinc-600 outline-none transition resize-none focus:border-[#b8955a] focus:ring-1 focus:ring-[#b8955a]" />
        </div>
      </div>
    </section>
  );
};
