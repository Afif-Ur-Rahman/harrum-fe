"use client";
import React from "react";
import Image from "next/image";

interface MediaPreviewProps {
  src?: string | string[];
  alt?: string;
  className?: string;
  height?: number | string;
  width?: number | string;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  isMultiple?: boolean;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  src,
  alt = "Media content",
  className = "",
  height = "auto",
  width = 60,
  videoProps,
  isMultiple = false,
}) => {
  const mediaSources = Array.isArray(src) ? src : [src || "/default-image.png"];
  const videoExts = [".mp4", ".mov", ".webm", ".mkv", ".ogg"];

  const renderMedia = (mediaSrc: string, index: number) => {
    const isVideo =
      typeof mediaSrc === "string" &&
      videoExts.some((ext) => mediaSrc.toLowerCase().endsWith(ext));

    return (
      <div
        key={index}
        className={`relative w-full overflow-hidden rounded-lg bg-gray-100 ${className}`}
        style={{ height, width }}
      >
        {isVideo ? (
          <video
            src={mediaSrc}
            controls
            className="w-full h-full object-cover"
            {...videoProps}
          />
        ) : (
          <Image
            fill
            src={mediaSrc}
            alt={alt}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isMultiple ? "flex-wrap gap-4" : ""}`}>
      {isMultiple
        ? mediaSources.map((mediaSrc, index) => renderMedia(mediaSrc, index))
        : renderMedia(mediaSources[0], 0)}
    </div>
  );
};

export default MediaPreview;
