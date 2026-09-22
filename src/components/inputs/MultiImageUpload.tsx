"use client";

import { X, Plus, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface MultiImageUploadProps {
  mediaField?: string; // form field name for new File[] uploads
  existingField?: string; // form field name for kept existing URL strings
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
    setValue(
      mediaField,
      newFiles.map(f => f.file),
    );
  }, [newFiles, mediaField, setValue]);

  // When existingImages prop changes (edit mode reset), re-sync
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKept(existingImages);
    setNewFiles([]);
  }, [existingImages.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const withPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewFiles(prev => [...prev, ...withPreviews]);
    // Reset so same file can be re-added if needed
    e.target.value = "";
  };

  const removeExisting = (url: string) => setKept(prev => prev.filter(u => u !== url));

  const removeNew = (idx: number) => setNewFiles(prev => prev.filter((_, i) => i !== idx));

  const total = kept.length + newFiles.length;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {/* Existing saved images */}
        {kept.map(url => (
          <div key={url} className="group relative h-20 w-20 shrink-0">
            <Image
              src={url}
              alt="product"
              fill
              className="rounded-xl border border-gray-200 object-cover"
            />
            <button
              type="button"
              onClick={() => removeExisting(url)}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* New file previews */}
        {newFiles.map((f, idx) => (
          <div key={idx} className="group relative h-20 w-20 shrink-0">
            <Image
              src={f.preview}
              alt="new"
              fill
              className="rounded-xl border-2 border-blue-300 object-cover"
            />
            <button
              type="button"
              onClick={() => removeNew(idx)}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
            {/* "New" badge */}
            <span className="absolute bottom-0.5 left-0.5 rounded-sm bg-blue-500 px-1 text-[9px] font-bold text-white">
              NEW
            </span>
          </div>
        ))}

        {/* Add button — click opens picker (hold Ctrl/Cmd to pick multiple) */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-600"
        >
          <Plus className="h-5 w-5" />
          <span className="text-center text-[10px] leading-tight font-medium">Add photos</span>
        </button>
      </div>

      <p className="flex items-center gap-1 text-[11px] text-gray-400">
        <ImageIcon className="h-3 w-3 shrink-0" />
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
