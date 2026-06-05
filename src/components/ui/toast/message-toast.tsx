"use client";

import React from "react";
import { ProfileImage } from "../profile-image";
import { Typography } from "../typography";
import { User } from "@/types";

interface MessageToastProps {
  user: User;
  message: string;
  onClick?: () => void;
  onClose?: () => void;
}

export const MessageToast: React.FC<MessageToastProps> = ({
  user,
  message,
  onClick,
  onClose,
}) => {
  return (
    <div
      onClick={onClick}
      className="w-[92%] bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm cursor-pointer"
    >
      <div className="flex items-center flex-1">
        <ProfileImage size={40} imageUrl={user?.image} />
        <div className="ml-3 flex-1 overflow-hidden">
          <Typography variant="paragraphMedium" className="mb-0.5">
            {user?.fullName || "User"}
          </Typography>
          <Typography
            variant="paragraphSmall"
            className="line-clamp-2 text-gray-800"
          >
            {message}
          </Typography>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}
    </div>
  );
};
