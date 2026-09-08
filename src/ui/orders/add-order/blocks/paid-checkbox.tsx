import { useFormContext } from "react-hook-form";
import { OrderFormType } from "../form";

export const PaidCheckbox = () => {
  const { watch, setValue } = useFormContext<OrderFormType>();
  const isPaid = watch("isPaid");

  return (
    <label
      className="group flex cursor-pointer items-center gap-2"
      onClick={() => setValue("isPaid", !isPaid, { shouldDirty: true })}
    >
      <div
        className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border-2 transition-colors ${
          isPaid
            ? "border-cyan-400 bg-cyan-400"
            : "border-white/20 bg-white/5 group-hover:border-cyan-300"
        }`}
      >
        {isPaid && (
          <svg
            className="h-2.5 w-2.5 text-slate-950"
            fill="none"
            viewBox="0 0 10 8"
          >
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
      <span className="select-none text-sm text-slate-300">Paid</span>
    </label>
  );
};
