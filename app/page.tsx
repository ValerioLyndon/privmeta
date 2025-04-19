"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Dropzone from "@/components/Dropzone";
import { useState, useEffect } from "react";
import {
  stripImageMetadata,
  stripPdfMetadata,
  stripDocxMetadata,
} from "@/utils/stripMetadata";
import { MAX_FILE_COUNT, MAX_FILE_SIZE_MB } from "@/utils/constants";
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Lock, WifiOff } from "lucide-react";
import JSZip from "jszip";

type ErrorType =
  | "file_count"
  | "unsupported_format"
  | "file_too_large"
  | "general"
  | "dropzone_error";

const renameWithSuffix = (file: File, suffix = "_cleaned"): string => {
  const nameParts = file.name.split(".");
  if (nameParts.length < 2) return `${file.name}${suffix}`;
  const ext = nameParts.pop();
  const base = nameParts.join(".");
  return `${base}${suffix}.${ext}`;
};

const showErrorToast = (type: ErrorType) => {
  const warnings: ErrorType[] = [
    "file_count",
    "unsupported_format",
    "file_too_large",
    "general",
    "dropzone_error",
  ];

  const messages = {
    file_count: {
      title: "Too many files",
      description: `You can only upload up to ${MAX_FILE_COUNT} files.`,
    },
    unsupported_format: {
      title: "Unsupported file format",
      description:
        "Only .jpeg, .png, .webp, .pdf, and .docx files are supported.",
    },
    file_too_large: {
      title: "File too large",
      description: `Each file must be under ${MAX_FILE_SIZE_MB}MB.`,
    },
    general: {
      title: "Something went wrong",
      description: "An error occurred while processing your files.",
    },
    dropzone_error: {
      title: "Something went wrong",
      description: "An error occurred while queuing your files.",
    },
  };

  const { title, description } = messages[type];

  const show = warnings.includes(type) ? toast.warning : toast.error;

  show(title, {
    description,
    duration: 5000,
    dismissible: true,
  });
};

const Hero = ({ loading }: { loading: boolean }) => {
  return (
    <>
      {loading ? (
        <div className="w-full flex flex-col gap-[var(--space-lg)]">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[var(--space-lg)] w-full">
          <div className="flex gap-[var(--space-lg)] items-center">
            <h1 className="text-4xl font-bold">Remove metadata privately</h1>
            <Lock size={32} strokeWidth={3} />
          </div>
          <div className="text-lg text-muted-foreground">
            <p>
              Clean your files of hidden metadata without ever uploading them.
            </p>
            <p>
              Everything runs in your browser. Open Source. Private by design.
            </p>
          </div>
          <div className="flex gap-[var(--space-md)]">
            <Badge>Private</Badge>
            <Badge>Open source</Badge>
            <Badge>Works offline</Badge>
          </div>
        </div>
      )}
    </>
  );
};

const SeparatorSection = () => (
  <div className="w-full">
    <Separator />
  </div>
);

const DisableInternetSection = ({ loading }: { loading: boolean }) => {
  return (
    <>
      {loading ? (
        <div className="flex w-full gap-[var(--space-lg)] items-center bg-[var(--accent-secondary)] p-[var(--space-lg)] rounded-md">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ) : (
        <div className="flex w-full gap-[var(--space-lg)] items-center bg-[var(--accent-secondary)] p-[var(--space-lg)] rounded-md">
          <WifiOff size={32} strokeWidth={2} />
          <div>
            <h3 className="font-bold">If you are reading this...</h3>
            <p className="text-sm text-muted-foreground">
              You can safely disable your internet — all files are processed
              in-browser and never touch a server.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default function Home() {
  const [fileStore, setFileStore] = useState<File[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const infoTimeout = setTimeout(() => {
      toast.info("You can safely disable your internet", {
        id: "offline-mode",
        duration: 10000,
        description:
          "This app runs entirely in your browser and never uploads your files.",
        action: {
          label: "Got it",
          onClick: () => {},
        },
      });
    }, 2000);

    const loadingTimeout = setTimeout(() => setLoading(false), 1000);

    return () => {
      clearTimeout(infoTimeout);
      clearTimeout(loadingTimeout);
    };
  }, []);

  const handleFilesAccepted = (newFiles: File[]) => {
    const totalCount = fileStore.length + newFiles.length;
    if (totalCount > MAX_FILE_COUNT) {
      showErrorToast("file_count");
      return;
    }

    setFileStore((prevFiles) =>
      [...prevFiles, ...newFiles].slice(0, MAX_FILE_COUNT)
    );
    toast.success(
      newFiles.length <= 1 ? "1 File queued" : `${newFiles.length} files queued`
    );
  };

  const handleFileRemoved = (index: number) => {
    setFileStore((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleMetadataRemoval = async () => {
    setProcessing(true);

    try {
      const cleanedFiles: File[] = [];

      for (const file of fileStore) {
        let cleaned: File | null = null;

        if (file.type.startsWith("image/")) {
          cleaned = await stripImageMetadata(file);
        } else if (file.type === "application/pdf") {
          cleaned = await stripPdfMetadata(file);
        } else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          cleaned = await stripDocxMetadata(file);
        } else {
          showErrorToast("unsupported_format");
          continue;
        }
        if (cleaned) {
          const renamed = new File([cleaned], renameWithSuffix(file), {
            type: cleaned.type,
          });
          cleanedFiles.push(renamed);
        }
      }

      if (cleanedFiles.length === 1) {
        const file = cleanedFiles[0];
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      } else if (cleanedFiles.length > 1) {
        const zip = new JSZip();
        cleanedFiles.forEach((file) => zip.file(file.name, file));
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cleaned_files.zip";
        a.click();
        URL.revokeObjectURL(url);
      }

      toast.success("Download ready");
    } catch (error) {
      console.error("Error during metadata removal:", error);
      showErrorToast("general");
    } finally {
      setProcessing(false);
    }
  };

  const ClearAllButton = () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={fileStore.length <= 0 || processing} variant="ghost">
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
            onClick={() => setFileStore([])}
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
        <Hero loading={loading} />
        <SeparatorSection />
        <Dropzone
          loading={loading}
          fileStore={fileStore}
          onFilesAccepted={handleFilesAccepted}
          onFileRemove={handleFileRemoved}
          onError={(type: ErrorType) => showErrorToast(type)}
        />
        {loading ? (
          <div className="w-full flex gap-[var(--space-md)]">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-24" />
          </div>
        ) : (
          <div className="w-full flex gap-[var(--space-md)]">
            <Button
              disabled={fileStore.length <= 0 || processing}
              onClick={handleMetadataRemoval}
            >
              {processing && <Loader2 className="animate-spin mr-2" />}
              Remove metadata
            </Button>
            <ClearAllButton />
          </div>
        )}
        <SeparatorSection />
        <DisableInternetSection loading={loading} />
      </div>
    </div>
  );
}
