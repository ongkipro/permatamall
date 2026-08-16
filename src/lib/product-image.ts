export const MAX_PRODUCT_IMAGE_SIZE = 2 * 1024 * 1024;

export function hasWebpSignature(bytes: Uint8Array) {
  const ascii = (start: number, length: number) =>
    String.fromCharCode(...bytes.slice(start, start + length));
  return (
    bytes.length >= 12 &&
    ascii(0, 4) === "RIFF" &&
    ascii(8, 4) === "WEBP"
  );
}
