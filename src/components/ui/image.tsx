import * as React from "react";
import { useState } from "react";
import { cn } from "../../lib/utils";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: "video" | "square" | "wide" | "auto";
}

const aspectStyles = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  auto: "aspect-auto",
};

export const Image: React.FC<ImageProps> = ({
  src,
  alt = "Car preview",
  fallbackSrc = "https://placehold.co/600x400/18181b/a1a1aa?text=Image+Unavailable",
  aspectRatio = "video",
  className = "",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-zinc-900 w-full", aspectStyles[aspectRatio], className)}>
      {/* Hiệu ứng Skeleton shimmer khi đang tải ảnh xe */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse" />
      )}

      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={cn(
          "h-full w-full object-cover transition-all duration-500",
          isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
        )}
        {...props}
      />
    </div>
  );
};