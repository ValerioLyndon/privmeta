"use client";

import React, { useCallback, useState } from "react";
import { File, X } from "lucide-react";
import { Button } from "./ui/button";

type DropzoneProps = {
  fileStore: File[];
  onFilesAccepted: (files: File[]) => void;
  onFileRemove: (index: number) => void;
};

const acceptedTypes: Record<string, string[]> = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

const MAX_FILE_COUNT = 10;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const isAcceptedSize = (file: File) => file.size <= MAX_FILE_SIZE_BYTES;

const acceptedMimeTypes = Object.keys(acceptedTypes);

export default function Dropzone({ fileStore, onFilesAccepted, onFileRemove }: DropzoneProps) {
  const [highlight, setHighlight] = useState(false);

  const isAcceptedType = (file: File) => acceptedMimeTypes.includes(file.type);

  const handleFiles = (files: FileList | File[]) => {
    const filteredFiles = Array.from(files).filter(
      (file) => isAcceptedType(file) && isAcceptedSize(file)
    );

    const totalFiles = Math.min(MAX_FILE_COUNT, filteredFiles.length);

    const fileArray = filteredFiles.slice(0, totalFiles);

    if (fileArray.length === 0) return;

    onFilesAccepted(fileArray);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setHighlight(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    },
    [onFilesAccepted]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
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
        className={`relative flex flex-col items-center justify-center w-full min-h-96 gap-[var(--space-md)] border-3 border-dashed p-[var(--space-2xl)] rounded-xl cursor-pointer transition-colors ${highlight ? "border-orange-400 bg-blue-50" : "border-muted-foreground/50"
          }`}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <input
          id="fileInput"
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
            <span className="text-orange-400 font-bold hover:underline">
              browse
            </span>
          </p>
        </div>

        <p className="text-muted-foreground">(Accepted types: .jpeg, .png, .pdf, .webp)</p>

        {fileStore.length > 0 && (
          <ul className="text-left text-sm font-bold text-muted-foreground">
            {fileStore.map((file, index) => (
              <li
                key={index}
                className="truncate flex items-center gap-[var(--space-sm)]"
              >
                <span className="truncate mr-[var(--space-sm)]">📄</span>
                <p className="truncate">{file.name}</p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove(index)
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
        <p className="absolute text-sm text-muted-foreground right-[var(--space-xl)] bottom-[var(--space-md)]">{`${fileStore.length}/${MAX_FILE_COUNT}`}</p>
      </div>
    </div>
  );
}
