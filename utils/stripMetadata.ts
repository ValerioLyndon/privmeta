import { PDFDocument } from "pdf-lib";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export async function stripVideoMetadata(file: File): Promise<File | null> {
  try {
    if (typeof window === "undefined") return null;

    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    // Load the input file into FFmpeg memory
    await ffmpeg.writeFile("input.mp4", await fetchFile(file));

    // Run the FFmpeg command to remove metadata
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map_metadata",
      "-1",
      "-c",
      "copy",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const blob = new Blob([data], { type: "video/mp4" });
    const cleanedFile = new File([blob], file.name, { type: "video/mp4" });

    return cleanedFile;
  } catch (err) {
    console.error("Video metadata stripping failed:", err);
    return null;
  }
}

export async function stripImageMetadata(file: File): Promise<File | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        const newFile = new File([blob], file.name, {
          type: file.type,
        });
        resolve(newFile);
        URL.revokeObjectURL(url);
      }, file.type);
    };

    img.onerror = () => {
      resolve(null);
    };

    img.src = url;
  });
}

export async function stripPdfMetadata(file: File): Promise<File | null> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setSubject("");
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer("");
  pdfDoc.setCreator("");
  pdfDoc.setCreationDate(new Date(0));
  pdfDoc.setModificationDate(new Date(0));

  const newPdfBytes = await pdfDoc.save();
  return new File([newPdfBytes], file.name, { type: "application/pdf" });
}

let cachedJSZip: typeof import("jszip") | null = null;

export async function stripDocxMetadata(file: File): Promise<File | null> {
  try {
    if (!file.name.endsWith(".docx")) {
      throw new Error("Unsupported file type. Only .docx files are allowed.");
    }

    if (!cachedJSZip) {
      cachedJSZip = (await import("jszip")).default;
    }

    const zip = await cachedJSZip.loadAsync(file);

    if (!zip.file("word/document.xml")) {
      throw new Error("Invalid DOCX file structure.");
    }

    const metadataPaths = [
      "docProps/core.xml",
      "docProps/app.xml",
      "docProps/custom.xml",
    ];

    for (const path of metadataPaths) {
      if (zip.file(path)) {
        zip.remove(path);
      }
    }

    const cleanedBlob = await zip.generateAsync({ type: "blob" });

    return new File([cleanedBlob], file.name, {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  } catch (err) {
    console.error(`Failed to strip metadata from DOCX (${file.name}):`, err);
    return null;
  }
}
