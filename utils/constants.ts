export {
  MAX_FILE_COUNT,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  ACCEPTED_FILE_TYPES,
};

const MAX_FILE_COUNT = 10;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};
