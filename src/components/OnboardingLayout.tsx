import React from "react";

interface OnboardingProps {
  heading?: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

const OnboardingLayout: React.FC<OnboardingProps> = ({ heading, text, children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left: Image Panel ─────────────────────────── */}
      <div className="relative lg:w-[45%] h-52 lg:h-auto shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/onboarding-img.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between h-full p-7 lg:p-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/r-dummy.png" alt="Logo" className="h-10 w-auto drop-shadow-md" />
            <span className="text-white font-semibold text-lg tracking-wide">Invo</span>
          </div>

          {/* Brand tagline — desktop only */}
          <div className="hidden lg:block">
            <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-3 font-medium">
              Premium Management
            </p>
            <h2 className="text-white text-4xl font-bold leading-snug">
              Restaurant<br />Excellence,<br />Simplified.
            </h2>
            <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-xs">
              A complete suite for managing your restaurant — from tables and orders to staff and analytics.
            </p>
          </div>

          {/* Mobile heading overlay */}
          <div className="lg:hidden">
            {heading && <p className="text-white text-2xl font-bold">{heading}</p>}
            {text && <p className="text-white/75 text-sm mt-1">{text}</p>}
          </div>
        </div>
      </div>

      {/* ── Right: Form Panel ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-10 lg:px-16">
        <div className="w-full max-w-md">

          {/* Desktop heading */}
          {(heading || text) && (
            <div className="mb-8 hidden lg:block">
              {heading && (
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{heading}</h1>
              )}
              {text && (
                <p className="text-gray-500 mt-2 text-sm">{text}</p>
              )}
            </div>
          )}

          {children}
        </div>
      </div>

    </div>
  );
};

export default OnboardingLayout;
