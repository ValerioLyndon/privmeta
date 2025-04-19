import { ACCEPTED_FILE_TYPES } from "./constants";

export const getFileExtensions = () => {
  const fileExtensions: string[] = [];
  Object.values(ACCEPTED_FILE_TYPES).forEach((extensions) => {
    fileExtensions.push(...extensions);
  });
  return fileExtensions.join(", ");
};
