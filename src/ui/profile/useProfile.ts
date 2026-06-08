"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { profileAPI } from "@/api/api-call/profile-api";
import { showToast } from "@/utils/toast";

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const useProfile = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { reset, setError } = form;

  const onSubmit = async (values: ChangePasswordForm) => {
    if (values.newPassword.length < 8) {
      setError("newPassword", {
        type: "manual",
        message: "New password must be at least 8 characters.",
      });
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "New password and confirm password do not match.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await profileAPI.updatePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      if (response.success) {
        reset();
        showToast("success", "Password changed successfully.");
      } else {
        showToast(
          "error",
          response.error || "Failed to change password. Please try again.",
        );
      }
    } catch (error) {
      showToast(
        "error",
        (error as Error)?.message ||
          "Failed to change password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    form.handleSubmit(onSubmit)();
  };

  return {
    form,
    loading,
    submit,
  };
};
