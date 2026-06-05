"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, ImageIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface MultiImageUploadProps {
  mediaField?: string;       // form field name for new File[] uploads
  existingField?: string;    // form field name for kept existing URL strings
  existingImages?: string[]; // URLs already saved in DB
}

export const MultiImageUpload = ({
  mediaField = "media",
  existingField = "existingMedia",
  existingImages = [],
}: MultiImageUploadProps) => {
  const { setValue } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const [kept, setKept] = useState<string[]>(existingImages);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);

  // Sync kept existing URLs into form
  useEffect(() => {
    setValue(existingField, kept);
  }, [kept, existingField, setValue]);

  // Sync new files into form
  useEffect(() => {
    setValue(mediaField, newFiles.map((f) => f.file));
  }, [newFiles, mediaField, setValue]);

  // When existingImages prop changes (edit mode reset), re-sync
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKept(existingImages);
    setNewFiles([]);
  }, [existingImages.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const withPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewFiles((prev) => [...prev, ...withPreviews]);
    // Reset so same file can be re-added if needed
    e.target.value = "";
  };

  const removeExisting = (url: string) =>
    setKept((prev) => prev.filter((u) => u !== url));

  const removeNew = (idx: number) =>
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));

  const total = kept.length + newFiles.length;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {/* Existing saved images */}
        {kept.map((url) => (
          <div key={url} className="relative w-20 h-20 shrink-0 group">
            <Image
              src={url}
              alt="product"
              fill
              className="object-cover rounded-xl border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeExisting(url)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* New file previews */}
        {newFiles.map((f, idx) => (
          <div key={idx} className="relative w-20 h-20 shrink-0 group">
            <Image
              src={f.preview}
              alt="new"
              fill
              className="object-cover rounded-xl border-2 border-blue-300"
            />
            <button
              type="button"
              onClick={() => removeNew(idx)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            {/* "New" badge */}
            <span className="absolute bottom-0.5 left-0.5 text-[9px] font-bold bg-blue-500 text-white px-1 rounded-sm">
              NEW
            </span>
          </div>
        ))}

        {/* Add button — click opens picker (hold Ctrl/Cmd to pick multiple) */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-20 h-20 shrink-0 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-medium text-center leading-tight">Add photos</span>
        </button>
      </div>

      <p className="text-[11px] text-gray-400 flex items-center gap-1">
        <ImageIcon className="w-3 h-3 shrink-0" />
        {total === 0
          ? "No images yet — click Add photos to upload"
          : `${total} image${total === 1 ? "" : "s"} · select multiple at once in the picker`}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
