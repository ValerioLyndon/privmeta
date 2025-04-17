"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Lock, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import Dropzone from "@/components/Dropzone";
import { useState } from "react";
import { stripImageMetadata, stripPdfMetadata } from "@/utils/stripMetadata";
import { MAX_FILE_COUNT } from "@/utils/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type ErrorType = "file_count" | "unsupported_format" | "file_too_large" | "general" | null;

const Hero = () => (
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

const SeparatorSection = () => <div className="w-full"><Separator /></div>;

const ErrorAlert = ({ type }: { type: ErrorType }) => {
  if (!type) return null;

  const messages = {
    file_count: {
      title: "Too many files",
      description: `You can only upload up to ${MAX_FILE_COUNT} files at a time.`,
    },
    unsupported_format: {
      title: "Unsupported file format",
      description: "One or more files are not in a supported format (.jpeg, .png, .webp, .pdf).",
    },
    file_too_large: {
      title: "File too large",
      description: "One or more files exceed the maximum size limit.",
    },
    general: {
      title: "Something went wrong",
      description: "An error occurred while processing your files. Please try again.",
    }

  };

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{messages[type].title}</AlertTitle>
      <AlertDescription>{messages[type].description}</AlertDescription>
    </Alert>
  );
};

export default function Home() {
  const [fileStore, setFileStore] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ type: ErrorType } | null>(null);

  console.log(error)

  const handleFilesAccepted = (newFiles: File[]) => {
    const totalCount = fileStore.length + newFiles.length;
    setError(totalCount > MAX_FILE_COUNT ? { type: "file_count" } : null)
    setFileStore((prevFiles) => [...prevFiles, ...newFiles].slice(0, MAX_FILE_COUNT));
  };

  const handleFileRemoved = (index: number) => {
    setError(null);
    setFileStore((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleMetadataRemoval = async () => {
    setLoading(true);
    setError(null);

    try {
      const cleanedFiles = await Promise.all(
        fileStore.map(async (file) => {
          if (file.type.startsWith("image/")) {
            return await stripImageMetadata(file);
          }
          if (file.type === "application/pdf") {
            return await stripPdfMetadata(file);
          }
          throw new Error("Unsupported file type");
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
    } catch (error) {
      console.error("Metadata removal failed:", error);
      setError({ type: "general" });
    } finally {
      setLoading(false);
    }
  };


  const ClearAllButton = () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={fileStore.length <= 0 || loading} variant="ghost">
          Clear all
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear all files?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove all files from your current selection.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setError(null);
              setFileStore([]);
            }}
            className="bg-destructive hover:bg-destructive/90"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[var(--max-content-width)] px-[var(--space-md)] flex flex-col gap-[var(--space-2xl)] h-full items-center py-[var(--space-2xl)]">
        <Hero />
        <SeparatorSection />
        <Dropzone
          fileStore={fileStore}
          onFilesAccepted={handleFilesAccepted}
          onFileRemove={handleFileRemoved}
          onError={(type: ErrorType) => setError({ type })}
        />
        <ErrorAlert type={error?.type ?? null} />
        <div className="w-full flex gap-[var(--space-md)]">
          <Button
            disabled={fileStore.length <= 0 || loading}
            onClick={handleMetadataRemoval}
          >
            {loading && <Loader2 className="animate-spin" />}
            Remove metadata
          </Button>
          <ClearAllButton />
        </div>
      </div>
    </div>
  );
}
