"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, ImageIcon } from "lucide-react";
import { useCompleteProfile } from "./useCompleteProfile";
import { useCompleteProfileForm } from "./form";
import { FormProvider, useFormContext } from "react-hook-form";
import OnboardingLayout from "@/components/OnboardingLayout";
import { FormInput } from "@/components/inputs/FormInput";
import LocationInput from "@/components/inputs/LocationInput";
import { AuthField } from "@/components/inputs/AuthField";
import { Mail, User } from "lucide-react";

const LogoPicker = ({ field }: { field: string }) => {
  const { setValue, watch } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const file: File[] | undefined = watch(field);
  const preview = file?.[0] ? URL.createObjectURL(file[0]) : "/images/r-dummy.png";

  return (
    <div className="relative group w-24 h-24 sm:w-28 sm:h-28">
      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
        <Image src={preview} alt="Logo" fill className="object-cover" />
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Camera className="w-5 h-5 text-white" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) setValue(field, Array.from(e.target.files));
        }}
      />
    </div>
  );
};

const CoverPicker = ({ field }: { field: string }) => {
  const { setValue, watch } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const file: File[] | undefined = watch(field);
  const preview = file?.[0] ? URL.createObjectURL(file[0]) : null;

  return (
    <div className="relative group w-full h-44">
      {preview ? (
        <Image src={preview} alt="Cover" fill className="object-cover" />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <ImageIcon className="w-7 h-7" />
            <span className="text-xs">Click to add cover photo</span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 hover:bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm transition"
      >
        <ImageIcon className="w-3.5 h-3.5" />
        {preview ? "Change cover" : "Add cover"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) setValue(field, Array.from(e.target.files));
        }}
      />
    </div>
  );
};

const CompleteProfilePage = () => {
  const { onCompleteProfile } = useCompleteProfile();
  const form = useCompleteProfileForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem("signup_email");
    const otp = sessionStorage.getItem("signup_otp");
    form.setValue("email", email || "");
    form.setValue("otp", otp || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    await form.handleSubmit(async (data) => {
      await onCompleteProfile(data);
      setIsLoading(false);
    })();
    setIsLoading(false);
  };

  return (
    <OnboardingLayout
      heading="Set up your profile"
      text="Almost there — tell us a bit about your restaurant"
    >
      <FormProvider {...form}>
        <div className="space-y-5">

          {/* Cover + Logo hero */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            <div className="relative">
              <CoverPicker field="coverImage" />
              {/* Logo overlaid at bottom-left of cover */}
              <div className="absolute -bottom-12 left-5">
                <LogoPicker field="image" />
              </div>
            </div>
            {/* Spacer so logo doesn't overlap content below */}
            <div className="pt-14 pb-3 px-5">
              <p className="text-xs text-gray-400">Restaurant logo & cover photo</p>
            </div>
          </div>

          {/* Email — disabled */}
          <AuthField
            label="Email Address"
            name="email"
            type="email"
            placeholder="your@email.com"
            icon={<Mail size={16} />}
            disabled
          />

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Username
            </label>
            <FormInput
              field="username"
              placeHolder="e.g. my_restaurant"
            />
          </div>

          {/* Full name */}
          <AuthField
            label="Restaurant / Full Name"
            name="fullName"
            placeholder="e.g. The Grand Bistro"
            icon={<User size={16} />}
          />

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Location
            </label>
            <LocationInput field="location" />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold tracking-wide hover:bg-gray-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Setting up…
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </div>
      </FormProvider>
    </OnboardingLayout>
  );
};

export default CompleteProfilePage;
