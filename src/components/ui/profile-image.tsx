"use client";
import React from "react";
import Image from "next/image";

interface ProfileImageProps {
  size?: number;
  imageUrl?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  size = 40,
  imageUrl,
}) => {
  return (
    <Image
    width={500}
    height={500}
      src={imageUrl || "/default-avatar.png"}
      alt="User Avatar"
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
};
