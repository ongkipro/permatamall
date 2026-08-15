import { getRuntimeEnv } from "./env";

export async function getStoreSupportWhatsapp(
  locals?: App.Locals,
): Promise<string> {
  const database = getRuntimeEnv(locals)?.OMS_DB;
  if (!database || typeof database !== "object") return "";

  try {
    const store = await (database as D1Database)
      .prepare("SELECT support_whatsapp FROM stores ORDER BY id LIMIT 1")
      .first<{ support_whatsapp: string | null }>();
    return store?.support_whatsapp?.replace(/\D/g, "") || "";
  } catch (error) {
    console.error("storefront-support-whatsapp-load", error);
    return "";
  }
}
