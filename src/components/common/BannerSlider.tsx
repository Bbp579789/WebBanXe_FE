import React, { useState, useEffect } from 'react';
import promoBanner from '../../assets/image/banner1.jpg';
import categoryBanner from '../../assets/image/banner2.jpg';

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkText: string;
}

const BANNERS: BannerItem[] = [
  {
    id: '1',
    title: 'THE NEW MERCEDES-BENZ',
    subtitle: 'Định nghĩa lại chuẩn mực xa xỉ và công nghệ hỗ trợ thông minh.',
    imageUrl: promoBanner,
    linkText: 'Khám phá ngay',
  },
  {
    id: '2',
    title: 'BMW & NGUYỄN SĨ CƯƠNG',
    subtitle: 'Đặc quyền trải nghiệm dịch vụ Bespoke chuyên biệt cùng chuyên viên 24/7.',
    imageUrl: categoryBanner,
    linkText: 'Khám phá ngay',
  },
];

export const BannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[720px] overflow-hidden bg-black select-none">
      {/* Slider Container */}
      <div
        className="flex h-full transition-transform duration-1000 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {BANNERS.map((banner, idx) => (
          <div key={banner.id} className="relative h-full min-w-full flex-shrink-0">
            {/* Ảnh Banner tràn viền kết hợp lớp phủ chuyển mờ đen đáy */}
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="h-full w-full object-cover brightness-[0.65]"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            {/* Lớp bóng đổ gradient từ trên xuống và từ dưới lên */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />

            {/* Nội dung Banner: Giữ nguyên size, đổi sang font Merriweather */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24 text-white pt-16">
              <span
                style={{ fontFamily: "'Merriweather', serif" }}
                className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#b8955a] mb-2"
              >
                Exclusive Collection
              </span>
              <h2
                style={{ fontFamily: "'Merriweather', serif" }}
                className="text-3xl sm:text-5xl lg:text-6xl font-bold max-w-2xl leading-tight tracking-wider uppercase"
              >
                {banner.title}
              </h2>
              <p
                style={{ fontFamily: "'Merriweather', serif" }}
                className="mt-4 text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-light"
              >
                {banner.subtitle}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <button className="rounded-full bg-[#b8955a] px-7 py-3 text-xs font-semibold tracking-wider uppercase text-black transition-all hover:bg-[#d4ad6e] hover:shadow-lg hover:shadow-[#b8955a]/20">
                  {banner.linkText}
                </button>
                <button className="rounded-full border border-white/40 px-6 py-3 text-xs font-semibold tracking-wider uppercase text-white transition hover:border-white hover:bg-white/10 backdrop-blur-sm">
                  Yêu cầu tư vấn
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mũi tên chuyển slide */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1))}
        className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-sm transition hover:border-[#b8955a] hover:text-[#b8955a] hover:bg-black/70"
        aria-label="Previous Slide"
      >
        ❮
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % BANNERS.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-sm transition hover:border-[#b8955a] hover:text-[#b8955a] hover:bg-black/70"
        aria-label="Next Slide"
      >
        ❯
      </button>

      {/* Dấu chấm phân trang */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2.5 z-10">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-8 bg-[#b8955a]' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;