import type { APIRoute } from "astro";
import { jsonError, jsonOk } from "../../../lib/api";
import { getRuntimeEnv } from "../../../lib/env";
import {
  hasWebpSignature,
  MAX_PRODUCT_IMAGE_SIZE,
} from "../../../lib/product-image";

export const prerender = false;

const MAX_REQUEST_SIZE = MAX_PRODUCT_IMAGE_SIZE + 64 * 1024;
const MAX_UPLOADS_PER_HOUR = 20;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getRuntimeEnv(locals);
    const bucket = env?.ASSET_BUCKET as R2Bucket | undefined;
    const sessions = env?.SESSION as KVNamespace | undefined;
    if (!bucket || !sessions) {
      return jsonError("Asset storage belum tersedia.", 503);
    }

    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE) {
      return jsonError("Ukuran file maksimal 2 MB.", 413);
    }

    const clientIp = request.headers.get("cf-connecting-ip")?.trim() || "local";
    const uploadKey = `admin-upload-count:${clientIp}:${Math.floor(Date.now() / 3_600_000)}`;
    const uploadCount = Number(await sessions.get(uploadKey)) || 0;
    if (uploadCount >= MAX_UPLOADS_PER_HOUR) {
      return jsonError("Batas 20 upload per jam telah tercapai.", 429);
    }

    const formData = await request.formData();
    const fileInput = formData.get("file");
    const file = fileInput instanceof File ? fileInput : null;

    if (!file) {
      return jsonError("File upload is required", 400);
    }
    if (file.type !== "image/webp") {
      return jsonError("File upload harus berformat WEBP.", 415);
    }
    if (file.size <= 0) {
      return jsonError("File upload tidak boleh kosong.", 400);
    }
    if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
      return jsonError("Ukuran file maksimal 2 MB.", 413);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!hasWebpSignature(bytes)) {
      return jsonError(
        "Isi file tidak sesuai dengan tipe gambar yang dipilih.",
        415,
      );
    }

    const fileName = `uploads/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.webp`;
    await bucket.put(fileName, bytes, {
      httpMetadata: {
        contentType: "image/webp",
        cacheControl: "public, max-age=31536000, immutable",
        contentDisposition: "inline",
      },
    });
    await sessions.put(uploadKey, String(uploadCount + 1), {
      expirationTtl: 60 * 60,
    });

    return jsonOk({
      url: `/assets/${fileName}`,
      fileName,
    });
  } catch (error) {
    console.error("admin-upload-r2-post", error);
    return jsonError("Gagal mengunggah berkas.", 500);
  }
};
