"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Flex, Text } from "@radix-ui/themes";
import { useFormContext } from "react-hook-form";
import { Input } from "react-aria-components";
import { PlayCircle } from "lucide-react";

interface ImageUploadProps {
  image?: string | string[];
  field: string;
  isMultiple?: boolean;
  className?: string;
  disabled?: boolean;
  accept?: string;
}

const ImageUpload = ({
  image,
  field,
  isMultiple = false,
  className = "w-32.5 h-32.5",
  disabled = false,
  accept = ".jpg,.jpeg,.png,.mp4",
}: ImageUploadProps) => {
  const form = useFormContext();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Watch the form field to detect when it's been reset
  const formValue = form?.watch(field);

  useEffect(() => {
    if (!formValue || (Array.isArray(formValue) && formValue.length === 0)) {
      const clearSelectedFiles = () => {
        setSelectedFiles([]);
      };
      clearSelectedFiles();
    }
  }, [formValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      let filesArray = Array.from(e.target.files);

      if (filesArray.length > 10) filesArray = filesArray.slice(0, 10);

      setSelectedFiles(filesArray);
      form.setValue(field as string, filesArray);
    }
  };

  const previews =
    selectedFiles.length > 0
      ? selectedFiles.map((file) => URL.createObjectURL(file))
      : image
      ? Array.isArray(image)
        ? image
        : [image]
      : [];
  const renderPreview = (src: string, idx: number) => {
    const isVideo =
      src?.endsWith?.(".mp4") || selectedFiles[idx]?.type?.includes("video");

    return isVideo ? (
      <div
        key={idx}
        className={`relative w-24 h-24 border cursor-pointer rounded-md overflow-hidden ${
          disabled ? "opacity-60" : ""
        }`}
      >
        <video key={idx} src={src} width={150} height={150} />
        <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white opacity-90" />
      </div>
    ) : (
      <Image
        key={idx}
        src={src}
        width={150}
        height={150}
        className={`border cursor-pointer object-cover rounded-full ${className} ${
          disabled ? "opacity-60" : ""
        }`}
        alt="Preview"
      />
    );
  };

  return (
    <>
      <Flex
        justify="center"
        align="center"
        gap="3"
        className="overflow-y-auto flex-wrap max-h-40"
      >
        <Text
          as="label"
          htmlFor={field}
          className="block text-sm font-medium text-gray-900 cursor-pointer"
        >
          {previews.length > 0 ? (
            <Flex gap="2" wrap="wrap">
              {previews.map((src, idx) => renderPreview(src as string, idx))}
            </Flex>
          ) : (
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors ${className} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <svg
                className="w-6 h-6 text-gray-400 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs text-gray-400">Click to upload</span>
            </div>
          )}
        </Text>

        <Input
          type="file"
          id={field}
          accept={accept}
          multiple={isMultiple}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </Flex>
      <br />
    </>
  );
};

export { ImageUpload };
