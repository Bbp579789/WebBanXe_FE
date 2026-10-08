import React from 'react';
import { Layers, Volume2, Paintbrush, Key } from 'lucide-react';

export const AtelierProtocols: React.FC = () => {
  return (
    <section className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl pt-28">
      {/* Title[cite: 3] */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200 bg-white text-[10px] font-mono tracking-widest text-[#b8955a] uppercase font-semibold mb-3 shadow-xs">
          <span>MANUFAKTUR & ATELIER PROTOCOLS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950 tracking-tight">
          Nghệ Thuật Thủ Công & Trải Nghiệm Thượng Lưu
        </h2>
        <p className="mt-3 text-xs text-zinc-600 leading-relaxed">
          Hơn cả một phương tiện vận chuyển, Mercedes-Maybach là biểu tượng sống của lòng kiêu hãnh và tay nghề thủ công đỉnh cao của các nghệ nhân bậc thầy Sindelfingen.
        </p>
      </div>

      {/* Grid[cite: 3] */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        {/* Left Side: First-Class Suite[cite: 3] */}
        <div className="relative rounded-3xl overflow-hidden min-h-[400px] lg:min-h-[520px] border border-zinc-200/80 group">
          <img
            src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1000&auto=format&fit=crop&q=80"
            alt="Khoang Khánh Tiết First-Class Suite"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 p-8 sm:p-10 text-white">
            <span className="inline-block px-2.5 py-1 rounded bg-[#b8955a] text-black text-[9px] font-mono font-bold tracking-widest uppercase mb-3">
              SINDELFINGEN HANDCRAFTED
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide">
              Khoang Khánh Tiết First-Class Suite
            </h3>
            <p className="mt-2 text-xs text-zinc-300 leading-relaxed max-w-md">
              Trang bị cặp ly sâm panh mạ bạc Robbe & Berking đặt riêng trong hộc giữ lạnh có khóa an toàn.
            </p>
          </div>
        </div>

        {/* Right Side: 4 Protocols[cite: 3] */}
        <div className="flex flex-col justify-between gap-4">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-start gap-5 hover:border-zinc-300 transition">
            <div className="size-11 rounded-xl bg-[#fbf6ec] text-[#b8955a] flex items-center justify-center shrink-0">
              <Layers className="size-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-950 font-sans">
                Da Nappa Maybach-Exclusive
              </h4>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                Các mảng da tự nhiên mềm mại nhất được tuyển chọn nghiêm ngặt và khâu chần họa tiết kim cương thủ công tinh xảo, phối hài hòa với ốp gỗ sơn mài dương cẩm đen hoặc gỗ óc chó hoa văn tự nhiên.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-start gap-5 hover:border-zinc-300 transition">
            <div className="size-11 rounded-xl bg-[#fbf6ec] text-[#b8955a] flex items-center justify-center shrink-0">
              <Volume2 className="size-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-950 font-sans">
                Âm Thanh Burmester® High-End 4D Surround
              </h4>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                Hệ thống 31 loa công suất 1.750 Watt tích hợp củ rung xúc giác gắn trực tiếp vào tựa lưng ghế, biến khoang xe thành nhà hát thính phòng giao hưởng riêng tư tuyệt hảo.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-start gap-5 hover:border-zinc-300 transition">
            <div className="size-11 rounded-xl bg-[#fbf6ec] text-[#b8955a] flex items-center justify-center shrink-0">
              <Paintbrush className="size-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-950 font-sans">
                Quy Trình Sơn Hai Tông Thủ Công 7 Ngày
              </h4>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                Đường phân định mũi xe pinstripe 4mm tinh chuẩn được các bậc thầy sơn vẽ tay hoàn toàn, mất hơn 7 ngày làm việc để hoàn thiện và phủ bóng gương siêu cấp.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-start gap-5 hover:border-zinc-300 transition">
            <div className="size-11 rounded-xl bg-[#fbf6ec] text-[#b8955a] flex items-center justify-center shrink-0">
              <Key className="size-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-950 font-sans">
                Lễ Bàn Giao VIP Escrow & Quản Gia 24/7
              </h4>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                Mỗi giao dịch Mercedes-Maybach đều được ký kết trong phòng Salon riêng biệt, phong tỏa tài chính qua định chế bảo chứng và giao xe bằng xe lồng kính bọc nhung đến tận tư gia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};