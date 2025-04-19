import { PDFDocument } from "pdf-lib";

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

export async function stripDocxMetadata(file: File): Promise<File | null> {
  try {
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(file);
    const metadataFiles = [
      "docProps/core.xml",
      "docProps/app.xml",
      "docProps/custom.xml",
    ];

    metadataFiles.forEach((path) => {
      if (zip.file(path)) {
        zip.remove(path); // strip known metadata files
      }
    });

    const cleanedBlob = await zip.generateAsync({ type: "blob" });
    return new File([cleanedBlob], file.name, { type: file.type });
  } catch (err) {
    console.error("Failed to strip metadata from DOCX:", err);
    return null;
  }
}
