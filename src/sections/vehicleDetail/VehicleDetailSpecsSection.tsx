import React from 'react';
import {
  Zap,
  Sliders,
  Gauge,
  Maximize2,
} from 'lucide-react';
import { useVehicleDetail } from '../../hooks/useVehicleDetail';

export const VehicleDetailSpecsSection: React.FC = () => {
  const { vehicle } = useVehicleDetail();

  const brandName = vehicle?.brand || 'Mercedes-Benz';
  const modelName = vehicle?.model || 'Vehicle';
  const variantName = vehicle?.variant || '';

  // Định dạng dữ liệu
  const formatValue = (
    value: string | number | null | undefined,
    fallback = 'Đang cập nhật'
  ) => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }

    return value;
  };

  const specifications = [
    {
      title: 'ĐỘNG CƠ & CÔNG SUẤT',
      icon: <Zap className="size-4 text-[#b8955a]" />,
      items: [
        {
          label: 'Động cơ',
          value: formatValue(vehicle?.engine),
        },
        {
          label: 'Công suất',
          value: vehicle?.power_hp
            ? `${vehicle.power_hp} HP`
            : 'Đang cập nhật',
          highlight: true,
        },
        {
          label: 'Mô-men xoắn',
          value: vehicle?.torque_nm
            ? `${vehicle.torque_nm} Nm`
            : 'Đang cập nhật',
        },
        {
          label: 'Nhiên liệu',
          value: formatValue(vehicle?.fuel),
        },
      ],
    },
    {
      title: 'VẬN HÀNH & DẪN ĐỘNG',
      icon: <Sliders className="size-4 text-[#b8955a]" />,
      items: [
        {
          label: 'Hộp số',
          value: formatValue(vehicle?.transmission),
        },
        {
          label: 'Hệ dẫn động',
          value: formatValue(vehicle?.drivetrain),
        },
        {
          label: 'Số chỗ ngồi',
          value: vehicle?.seats
            ? `${vehicle.seats} chỗ`
            : 'Đang cập nhật',
        },
        {
          label: 'Màu nội thất',
          value: formatValue(vehicle?.interior_color),
        },
      ],
    },
    {
      title: 'TỐC ĐỘ & TĂNG TỐC',
      icon: <Gauge className="size-4 text-[#b8955a]" />,
      items: [
        {
          label: 'Tăng tốc 0-100 km/h',
          value: vehicle?.acceleration
            ? `${vehicle.acceleration} giây`
            : 'Đang cập nhật',
          highlight: true,
        },
        {
          label: 'Vận tốc tối đa',
          value: vehicle?.top_speed
            ? `${vehicle.top_speed} km/h`
            : 'Đang cập nhật',
        },
        {
          label: 'Trạng thái xe',
          value: formatValue(vehicle?.status),
        },
        {
          label: 'Năm sản xuất',
          value: formatValue(vehicle?.year),
        },
      ],
    },
    {
      title: 'THÔNG TIN NGOẠI THẤT',
      icon: <Maximize2 className="size-4 text-[#b8955a]" />,
      items: [
        {
          label: 'Màu ngoại thất',
          value: formatValue(vehicle?.exterior_color),
        },
        {
          label: 'Thương hiệu',
          value: formatValue(vehicle?.brand),
        },
        {
          label: 'Dòng xe',
          value: formatValue(vehicle?.model),
        },
        {
          label: 'Phiên bản',
          value: formatValue(vehicle?.variant),
        },
      ],
    },
  ];

  return (
    <section className="container mx-auto max-w-7xl select-none px-6 py-8 sm:px-10 lg:px-12">
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-8 shadow-sm sm:p-10">

        {/* Tiêu đề */}
        <div className="mb-8 flex flex-col justify-between gap-3 border-b border-zinc-100 pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#b8955a]">
              SPECIFICATIONS
            </span>

            <h2 className="mt-1 font-serif text-2xl font-bold text-zinc-950 sm:text-3xl">
              Thông Số Kỹ Thuật & Hiệu Năng Vận Hành
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              {brandName} {modelName} {variantName}
            </p>
          </div>

          <span className="font-mono text-xs text-zinc-400">
            Thông tin xe từ hệ thống
          </span>
        </div>

        {/* Các nhóm thông số */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {specifications.map((group, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-900">
                {group.icon}
                <span>{group.title}</span>
              </div>

              <div className="space-y-3 pt-1">
                {group.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-2"
                  >
                    <span className="shrink-0 text-xs text-zinc-500">
                      {item.label}
                    </span>

                    <span
                      className={`text-right text-xs ${
                        item.highlight
                          ? 'font-mono font-semibold text-[#b8955a]'
                          : 'font-mono font-medium text-zinc-900'
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleDetailSpecsSection;