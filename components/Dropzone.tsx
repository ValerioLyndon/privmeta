"use client";

import React, { useCallback, useState } from "react";
import { File } from "lucide-react";

type DropzoneProps = {
  onFilesAccepted: (files: File[]) => void;
};

const acceptedTypes: Record<string, string[]> = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

const acceptedMimeTypes = Object.keys(acceptedTypes);

export default function Dropzone({ onFilesAccepted }: DropzoneProps) {
  const [highlight, setHighlight] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const isAcceptedType = (file: File) => acceptedMimeTypes.includes(file.type);

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(isAcceptedType);

    if (fileArray.length === 0) return;

    setFileNames(fileArray.map((file) => file.name));
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
        className={`flex flex-col items-center justify-center w-full h-96 gap-[var(--space-md)] border-3 border-dashed p-6 rounded-xl cursor-pointer transition-colors ${
          highlight ? "border-orange-400 bg-blue-50" : "border-gray-300"
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

        {fileNames.length > 0 && (
          <ul className="text-left text-sm text-muted-foreground">
            {fileNames.map((name, index) => (
              <li key={index} className="truncate">
                📄 {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
