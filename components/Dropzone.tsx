"use client";

import React, { useCallback, useRef, useState } from "react";
import { File, X } from "lucide-react";
import { Button } from "./ui/button";
import { MAX_FILE_SIZE_BYTES, MAX_FILE_COUNT } from "@/utils/constants";

type DropzoneProps = {
  fileStore: File[];
  onFilesAccepted: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  onError: (type: "unsupported_format" | "file_too_large") => void;
};

const acceptedTypes: Record<string, string[]> = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

const acceptedMimeTypes = Object.keys(acceptedTypes);

export default function Dropzone({
  fileStore,
  onFilesAccepted,
  onFileRemove,
  onError,
}: DropzoneProps) {
  const [highlight, setHighlight] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAcceptedType = (file: File) => acceptedMimeTypes.includes(file.type);
  const isAcceptedSize = (file: File) => file.size <= MAX_FILE_SIZE_BYTES;

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const newFiles: File[] = [];

      for (const file of files) {
        if (!isAcceptedType(file)) {
          onError("unsupported_format");
          return;
        }
        if (!isAcceptedSize(file)) {
          onError("file_too_large");
          return;
        }
        newFiles.push(file);
      }

      if (newFiles.length > 0) {
        onFilesAccepted(newFiles);
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [onError, onFilesAccepted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setHighlight(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    },
    [handleFiles]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setHighlight(true);
        }}
        onDragLeave={() => setHighlight(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full min-h-96 gap-[var(--space-md)] border-3 border-dashed p-[var(--space-2xl)] rounded-xl cursor-pointer transition-colors ${
          highlight
            ? "border-[var(--dropzone-primary)] bg-blue-50"
            : "border-muted-foreground/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedMimeTypes.join(",")}
          onChange={handleChange}
          className="hidden"
        />
        <File size={64} strokeWidth={2} />
        <div className="flex flex-col items-center text-lg text-muted-foreground">
          <p>Drag & drop</p>
          <p>
            or{" "}
            <span className="text-[var(--dropzone-primary)] font-bold hover:underline">
              browse
            </span>
          </p>
        </div>
        <p className="text-muted-foreground">
          (Accepted types: .jpeg, .png, .webp, .pdf)
        </p>
        {fileStore.length > 0 && (
          <ul className="text-left text-sm font-bold text-muted-foreground">
            {fileStore.map((file, index) => (
              <li
                key={index}
                className="truncate flex items-center gap-[var(--space-sm)]"
              >
                <File
                  className="mr-[var(--space-sm)]"
                  size={20}
                  strokeWidth={2}
                />
                <p className="truncate">{file.name}</p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove(index);
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        )}
        <p className="absolute text-sm text-muted-foreground right-[var(--space-xl)] bottom-[var(--space-md)]">
          {`${fileStore.length}/${MAX_FILE_COUNT}`}
        </p>
      </div>
    </div>
  );
}
