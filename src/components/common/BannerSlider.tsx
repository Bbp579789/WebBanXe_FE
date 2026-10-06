import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Image } from '../ui/image';
import banner1 from '../../assets/image/banner1.jpg';
import banner2 from '../../assets/image/banner2.jpg';
import banner3 from '../../assets/image/banner3.jpg';

interface BannerItem {
  id: string;
  tag?: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkText: string;
}

const BANNERS: BannerItem[] = [
  {
    id: '1',
    tag: 'Exclusive Collection',
    title: 'THE NEW MERCEDES-BENZ',
    subtitle: 'Định nghĩa lại chuẩn mực xa xỉ và công nghệ hỗ trợ thông minh.',
    imageUrl: banner1,
    linkText: 'Khám phá ngay',
  },
  {
    id: '2',
    tag: 'Bespoke Experience',
    title: 'BMW & NGUYỄN SĨ CƯƠNG',
    subtitle: 'Đặc quyền trải nghiệm dịch vụ Bespoke chuyên biệt cùng chuyên viên 24/7.',
    imageUrl: banner2,
    linkText: 'Khám phá ngay',
  },
   {
    id: '3',
    tag: 'Bespoke Experience',
    title: 'BMW & NGUYỄN SĨ CƯƠNG',
    subtitle: 'Đặc quyền trải nghiệm dịch vụ Bespoke chuyên biệt cùng chuyên viên 24/7.',
    imageUrl: banner3,
    linkText: 'Khám phá ngay',
  },
];

export const BannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  return (
    <section
      aria-label="Car Highlights Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[520px] sm:h-[620px] lg:h-[720px] overflow-hidden bg-black select-none"
    >
      {/* Slider Reel */}
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {BANNERS.map((banner, idx) => (
          <div key={banner.id} className="relative h-full min-w-full flex-shrink-0">
            {/* Ảnh nền tích hợp Image component (có skeleton/fade-in) */}
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              aspectRatio="auto"
              className="h-full w-full object-cover brightness-[0.65]"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />

            {/* Gradient Overlay tối màu */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

            {/* Nội dung Banner */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24 text-white pt-16">
              {banner.tag && (
                <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#b8955a] font-serif mb-2">
                  {banner.tag}
                </span>
              )}

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight tracking-wider uppercase font-serif">
                {banner.title}
              </h2>

              <p className="mt-4 text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed font-light font-serif">
                {banner.subtitle}
              </p>

              {/* Nút hành động dùng Button component */}
              <div className="mt-8 flex items-center gap-4">
                <Button variant="brand" size="default" className="rounded-full px-8">
                  {banner.linkText}
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="rounded-full px-7 border-white/40 text-white hover:border-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Yêu cầu tư vấn
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mũi tên điều hướng Previous/Next */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-sm transition-all hover:border-[#b8955a] hover:text-[#b8955a] hover:bg-black/70 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-sm transition-all hover:border-[#b8955a] hover:text-[#b8955a] hover:bg-black/70 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dấu chấm phân trang (Indicators) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx ? 'w-8 bg-[#b8955a]' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Đi tới slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;