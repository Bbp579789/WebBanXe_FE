import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Image } from "./image";

export interface ImgButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  imageSrc: string;
  title: string;
  subtitle?: string;
  badge?: string;
  aspectRatio?: "video" | "square" | "wide";
}

export const ImgButton: React.FC<ImgButtonProps> = ({
  imageSrc,
  title,
  subtitle,
  badge,
  aspectRatio = "video",
  className = "",
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-zinc-800/80 text-left transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8955a] hover:border-[#b8955a]/60 hover:shadow-xl hover:shadow-[#b8955a]/10",
        className
      )}
      {...props}
    >
      {/* Hình nền xe */}
      <Image
        src={imageSrc}
        alt={title}
        aspectRatio={aspectRatio}
        className="transition-transform duration-700 group-hover:scale-105"
      />

      {/* Lớp phủ Gradient mờ dần từ chân ảnh */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Badge góc trên nếu có */}
      {badge && (
        <span className="absolute top-3.5 left-3.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-widest text-[#b8955a] uppercase">
          {badge}
        </span>
      )}

      {/* Icon mũi tên góc phải */}
      <div className="absolute top-3.5 right-3.5 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-black group-hover:bg-[#b8955a] group-hover:border-[#b8955a] transition-all">
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      {/* Nội dung thông tin xe ở đáy Card */}
      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end text-white">
        <h3 className="font-serif text-lg font-bold tracking-wide group-hover:text-[#b8955a] transition-colors leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-xs text-zinc-400 font-sans line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
    </button>
  );
};