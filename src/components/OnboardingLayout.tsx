import React from "react";
import Image from "next/image";

interface OnboardingProps {
  heading?: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

const OnboardingLayout: React.FC<OnboardingProps> = ({
  heading,
  text,
  children,
  className = "",
}) => {
  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-slate-950 ${className}`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_52%,rgba(17,24,39,0.98)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.12),transparent_35%)]" />
      <div className="absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* ── Left: Image Panel ─────────────────────────── */}
        <div className="relative h-52 shrink-0 overflow-hidden border-b border-white/10 lg:h-auto lg:w-[45%] lg:border-b-0 lg:border-r">
          <Image
            src="/images/onboarding-img.jpg"
            alt="Onboarding Image"
            className="absolute inset-0 h-full w-full object-cover"
            width={800}
            height={600}
            priority
          />

          {/* Image overlays */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.68)_0%,rgba(15,23,42,0.60)_45%,rgba(2,6,23,0.88)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.18),transparent_38%)]" />

          {/* Content over image */}
          <div className="relative z-10 flex h-full flex-col justify-between p-7 lg:p-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-black/20 backdrop-blur-md">
                <span className="text-sm font-bold text-cyan-300">HC</span>
              </div>

              <div>
                <span className="block text-lg font-semibold tracking-wide text-white">
                  Harrum Cloth House
                </span>
                <span className="text-xs text-slate-400">Control Center</span>
              </div>
            </div>

            {/* Brand tagline — desktop only */}
            <div className="hidden lg:block">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                Premium Clothing Management
              </p>

              <h2 className="text-4xl font-bold leading-snug text-white">
                Clothing
                <br />
                Management,
                <br />
                Simplified.
              </h2>

              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
                A complete suite for managing your clothing store — from
                products and orders to inventory and analytics.
              </p>
            </div>

            {/* Mobile heading overlay */}
            <div className="lg:hidden">
              {heading && (
                <p className="text-2xl font-bold text-white">{heading}</p>
              )}

              {text && <p className="mt-1 text-sm text-slate-300">{text}</p>}
            </div>
          </div>
        </div>

        {/* ── Right: Form Panel ─────────────────────────── */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            {/* Desktop heading */}
            {(heading || text) && (
              <div className="mb-8 hidden lg:block">
                {heading && (
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    {heading}
                  </h1>
                )}

                {text && <p className="mt-2 text-sm text-slate-400">{text}</p>}
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
