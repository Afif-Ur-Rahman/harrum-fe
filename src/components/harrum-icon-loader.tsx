"use client";

import Image from "next/image";

export const HarrumIconLoader = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px]">
      <div className="relative flex h-18 w-18 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_220deg,#06b6d4_260deg,#3b82f6_310deg,#d946ef_360deg)]" />

        <div className="absolute inset-0.75 rounded-full bg-slate-950" />

        <Image
          src="/icon.png"
          alt="Harrum"
          width={64}
          height={64}
          className="relative h-14 w-14 rounded-md object-contain"
          priority
        />
      </div>
    </div>
  );
};
