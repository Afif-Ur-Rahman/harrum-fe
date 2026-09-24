"use client";

import { useFormContext } from "react-hook-form";

import { OrderFormType } from "../form";

export const PrintCheckbox = () => {
  const { watch, setValue } = useFormContext<OrderFormType>();
  const print = watch("print");

  return (
    <label
      className="group flex cursor-pointer items-center gap-2"
      onClick={() => setValue("print", !print, { shouldDirty: true })}
    >
      <div
        className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border-2 transition-colors ${
          print
            ? "border-cyan-400 bg-cyan-400"
            : "border-white/20 bg-white/5 group-hover:border-cyan-300"
        }`}
      >
        {print && (
          <svg className="h-2.5 w-2.5 text-slate-950" fill="none" viewBox="0 0 10 8">
            <path
              d="M1 4l3 3 5-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-sm text-slate-300 select-none">Print</span>
    </label>
  );
};
