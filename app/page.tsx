"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Dropzone from "@/components/Dropzone";
import { Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { stripImageMetadata, stripPdfMetadata } from "@/utils/stripMetadata";

const Hero = () => {
  return (
    <div className="flex flex-col gap-[var(--space-md)] w-full">
      <div className="flex gap-[var(--space-lg)] items-center">
        <h1 className="text-4xl font-bold">Remove metadata privately</h1>
        <Lock size={32} strokeWidth={3} />
      </div>

      <div className="text-lg text-muted-foreground">
        <p>Clean your files of hidden metadata without ever uploading them.</p>
        <p>Everything runs in your browser. Open Source. Private by design.</p>
      </div>
      <div className="flex gap-[var(--space-md)]">
        <Button>Try it now</Button>
      </div>
    </div>
  );
};

const SeparatorSection = () => {
  return (
    <div className="w-full">
      <Separator />
    </div>
  );
};

export default function Home() {
  const [fileStore, setFileStore] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFilesAccepted = (files: File[]) => {
    console.log("Files received:", files);
    setFileStore(files);
  };

  const handleMetadataRemoval = async () => {
    setLoading(true);
    const cleanedFiles = await Promise.all(
      fileStore.map(async (file) => {
        if (file.type.startsWith("image/")) {
          return await stripImageMetadata(file);
        }
        if (file.type === "application/pdf") {
          return await stripPdfMetadata(file);
        }
        // Not supported
        return null;
      })
    );

    cleanedFiles.forEach((cleanedFile) => {
      if (cleanedFile) {
        const url = URL.createObjectURL(cleanedFile);
        const a = document.createElement("a");
        a.href = url;
        a.download = cleanedFile.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    });

    setLoading(false);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[var(--max-content-width)] px-[var(--space-md)] flex flex-col gap-[var(--space-2xl)] h-full items-center pt-[var(--space-2xl)]">
        <Hero />
        <SeparatorSection />
        <Dropzone onFilesAccepted={handleFilesAccepted} />
        <div className="w-full">
          <Button
            disabled={fileStore.length <= 0 || loading}
            onClick={handleMetadataRemoval}
          >
            {loading && <Loader2 className="animate-spin" />}
            Remove metadata
          </Button>
        </div>
      </div>
    </div>
  );
}
