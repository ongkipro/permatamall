import type { AutoLarisCheckoutChannel } from "./autolaris-client";

export type StorePaymentAvailability = {
  codEnabled: boolean;
  autoLarisEnabled: boolean;
  disabledAutoLarisChannels: ReadonlySet<string>;
};

type StorePaymentAvailabilityRow = {
  is_cod_enabled: number | null;
  is_autolaris_enabled: number | null;
  disabled_autolaris_channels: string | null;
};

export function isAutoLarisPaymentMethod(paymentMethod: string) {
  return paymentMethod === "bank_transfer" || paymentMethod === "qris";
}

export function parseDisabledAutoLarisChannels(
  value: string | null | undefined,
) {
  return new Set(
    String(value || "")
      .split(",")
      .map((channel) => channel.trim().toUpperCase())
      .filter(Boolean),
  );
}

export async function loadStorePaymentAvailability(
  database: D1Database,
): Promise<StorePaymentAvailability> {
  const row = await database
    .prepare(
      `SELECT is_cod_enabled, is_autolaris_enabled, disabled_autolaris_channels
       FROM stores
       ORDER BY id
       LIMIT 1`,
    )
    .first<StorePaymentAvailabilityRow>();

  if (!row) throw new Error("Store belum tersedia.");

  return {
    codEnabled: row.is_cod_enabled !== 0,
    autoLarisEnabled: row.is_autolaris_enabled !== 0,
    disabledAutoLarisChannels: parseDisabledAutoLarisChannels(
      row.disabled_autolaris_channels,
    ),
  };
}

export function isAutoLarisChannelEnabled(
  availability: StorePaymentAvailability,
  channelCode: AutoLarisCheckoutChannel,
) {
  return (
    availability.autoLarisEnabled &&
    !availability.disabledAutoLarisChannels.has(channelCode)
  );
}
