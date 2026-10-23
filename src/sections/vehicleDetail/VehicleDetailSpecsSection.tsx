import React from 'react';
import { Zap, Sliders, Gauge, Maximize2 } from 'lucide-react';
import { useVehicleDetail } from '../../hooks/useVehicleDetail';

export const VehicleDetailSpecsSection: React.FC = () => {
  const { vehicle } = useVehicleDetail();
  const brandName = vehicle?.brand || 'Mercedes-AMG';

  return (
    <section className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl py-8 select-none">
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-8 sm:p-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-100 pb-6 mb-8 gap-3">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#b8955a] uppercase font-bold">
              SPECIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 mt-1">
              Thông Số Kỹ Thuật & Hiệu Năng Vận Hành
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Đã đồng bộ dữ liệu kỹ thuật từ {brandName} Affalterbach
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* CỘT 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs tracking-wider uppercase">
              <Zap className="size-4 text-[#b8955a]" />
              <span>ĐỘNG CƠ & CÔNG SUẤT</span>
            </div>
            <div className="space-y-3 text-xs pt-1">
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Mã động cơ</span>
                <span className="font-mono font-medium text-zinc-900">
                  {vehicle?.engine_no || '2.0L Turbo + E-Motor'}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Tổng công suất</span>
                <span className="font-mono font-semibold text-[#b8955a]">671 HP (500 kW)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Mô-men xoắn</span>
                <span className="font-mono font-medium text-zinc-900">1.020 Nm</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Dung lượng Pin</span>
                <span className="font-mono font-medium text-zinc-900">6.1 kWh AMG HPB</span>
              </div>
            </div>
          </div>

          {/* CỘT 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs tracking-wider uppercase">
              <Sliders className="size-4 text-[#b8955a]" />
              <span>VẬN HÀNH & DẪN ĐỘNG</span>
            </div>
            <div className="space-y-3 text-xs pt-1">
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Hộp số</span>
                <span className="font-medium text-zinc-900">AMG SPEEDSHIFT MCT 9G</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Hệ dẫn động</span>
                <span className="font-medium text-zinc-900">AMG 4MATIC+ All-Wheel</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Đánh lái trục sau</span>
                <span className="font-medium text-zinc-900">Tích hợp (lên tới 2.5°)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Hệ thống treo</span>
                <span className="font-medium text-zinc-900">AMG RIDE CONTROL</span>
              </div>
            </div>
          </div>

          {/* CỘT 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs tracking-wider uppercase">
              <Gauge className="size-4 text-[#b8955a]" />
              <span>TỐC ĐỘ & TĂNG TỐC</span>
            </div>
            <div className="space-y-3 text-xs pt-1">
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Tăng tốc 0-100 km/h</span>
                <span className="font-mono font-bold text-zinc-950">3.4 Giây</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Vận tốc tối đa</span>
                <span className="font-mono font-medium text-zinc-900">280 km/h (Mở khóa)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Phanh hiệu năng</span>
                <span className="font-medium text-zinc-900">AMG Carbon Ceramic</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Chế độ Drift Mode</span>
                <span className="font-medium text-zinc-900">Tiêu chuẩn</span>
              </div>
            </div>
          </div>

          {/* CỘT 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs tracking-wider uppercase">
              <Maximize2 className="size-4 text-[#b8955a]" />
              <span>KÍCH THƯỚC & TRỌNG LƯỢNG</span>
            </div>
            <div className="space-y-3 text-xs pt-1">
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Dài x Rộng x Cao</span>
                <span className="font-mono font-medium text-zinc-900">
                  4.842 x 1.900 x 1.458 mm
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Chiều dài cơ sở</span>
                <span className="font-mono font-medium text-zinc-900">2.875 mm</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Trọng lượng bản thân</span>
                <span className="font-mono font-medium text-zinc-900">2.165 kg</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Dung tích bình xăng</span>
                <span className="font-mono font-medium text-zinc-900">66 Lít</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleDetailSpecsSection;