/**
 * Central upload mode config.
 * NEXT_PUBLIC_UPLOAD_MODE = "blob" | "storage"
 *   blob    → base64 data URL embedded directly
 *   storage → file uploaded to server, returns path
 */
export type UploadMode = "blob" | "storage";

export function getUploadMode(): UploadMode {
  const mode = process.env.NEXT_PUBLIC_UPLOAD_MODE;
  return mode === "blob" ? "blob" : "storage";
}
