"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Dropzone from "@/components/Dropzone";
import { Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { stripImageMetadata, stripPdfMetadata } from "@/utils/stripMetadata";
import { MAX_FILE_COUNT } from "@/utils/constants";

const Hero = () => {
  return (
    <div className="flex flex-col gap-[var(--space-lg)] w-full">
      <div className="flex gap-[var(--space-lg)] items-center">
        <h1 className="text-4xl font-bold">Remove metadata privately</h1>
        <Lock size={32} strokeWidth={3} />
      </div>

      <div className="text-lg text-muted-foreground">
        <p>Clean your files of hidden metadata without ever uploading them.</p>
        <p>Everything runs in your browser. Open Source. Private by design.</p>
      </div>
      <div className="flex gap-[var(--space-md)]">
        <Badge>Private</Badge>
        <Badge>Free</Badge>
        <Badge>Open source</Badge>
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

  const handleFilesAccepted = (newFiles: File[]) => {
    setFileStore((prevFiles) => {
      const total = [...prevFiles, ...newFiles].slice(0, MAX_FILE_COUNT);
      return total;
    });
  };

  const handleFileRemoved = (index: number) => {
    setFileStore((fileStore) => fileStore.splice(index, 1))
  }

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
      <div className="w-full max-w-[var(--max-content-width)] px-[var(--space-md)] flex flex-col gap-[var(--space-2xl)] h-full items-center py-[var(--space-2xl)]">
        <Hero />
        <SeparatorSection />
        <Dropzone fileStore={fileStore} onFilesAccepted={handleFilesAccepted} onFileRemove={handleFileRemoved} />
        <div className="w-full flex gap-[var(--space-md)]">
          <Button
            disabled={fileStore.length <= 0 || loading}
            onClick={handleMetadataRemoval}
          >
            {loading && <Loader2 className="animate-spin" />}
            Remove metadata
          </Button>
          <Button
            disabled={fileStore.length <= 0 || loading}
            onClick={() => { setFileStore([]) }}
            variant="ghost"
          >
            Clear all
          </Button>
        </div>
      </div>
    </div>
  );
}
