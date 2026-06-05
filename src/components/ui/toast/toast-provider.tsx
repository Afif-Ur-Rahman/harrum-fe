"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        className: "shadow-lg rounded-md",
      }}
    />
  );
};
