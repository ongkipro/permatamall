import type { AutoLarisCheckoutChannel } from "./autolaris-client";

export type StoreCheckoutPaymentPolicy = {
  codEnabled: boolean;
  autoLarisEnabled: boolean;
  disabledAutoLarisChannels: ReadonlySet<AutoLarisCheckoutChannel>;
};

type StoreCheckoutPaymentPolicyRow = {
  is_cod_enabled: number | null;
  is_autolaris_enabled: number | null;
  disabled_autolaris_channels: string | null;
};

export type CheckoutPaymentAvailability =
  | { allowed: true }
  | { allowed: false; code: string; message: string };

export function parseDisabledAutoLarisChannels(
  value: unknown,
): Set<AutoLarisCheckoutChannel> {
  if (typeof value !== "string" || !value.trim()) return new Set();
  return new Set(
    value
      .split(",")
      .map((channel) => channel.trim().toUpperCase())
      .filter(Boolean) as AutoLarisCheckoutChannel[],
  );
}

export async function loadStoreCheckoutPaymentPolicy(
  database: D1Database,
): Promise<StoreCheckoutPaymentPolicy> {
  const row = await database
    .prepare(
      `SELECT is_cod_enabled, is_autolaris_enabled, disabled_autolaris_channels
       FROM stores
       ORDER BY id
       LIMIT 1`,
    )
    .first<StoreCheckoutPaymentPolicyRow>();

  return {
    codEnabled: row?.is_cod_enabled !== 0,
    autoLarisEnabled: row?.is_autolaris_enabled !== 0,
    disabledAutoLarisChannels: parseDisabledAutoLarisChannels(
      row?.disabled_autolaris_channels,
    ),
  };
}

export function checkCheckoutPaymentAvailability(input: {
  policy: StoreCheckoutPaymentPolicy;
  paymentMethod: "cod" | "bank_transfer" | "qris" | "manual_transfer";
  autoLarisChannel: AutoLarisCheckoutChannel | null;
  autoLarisConfigured: boolean;
}): CheckoutPaymentAvailability {
  if (input.paymentMethod === "cod") {
    return input.policy.codEnabled
      ? { allowed: true }
      : {
          allowed: false,
          code: "COD_DISABLED",
          message: "Pembayaran COD sedang tidak tersedia.",
        };
  }

  if (input.paymentMethod === "manual_transfer") return { allowed: true };

  if (!input.autoLarisChannel) {
    return {
      allowed: false,
      code: "PAYMENT_CHANNEL_REQUIRED",
      message: "Channel pembayaran wajib dipilih.",
    };
  }

  if (!input.policy.autoLarisEnabled) {
    return {
      allowed: false,
      code: "AUTOLARIS_DISABLED",
      message: "Pembayaran online sedang tidak tersedia.",
    };
  }
  if (!input.autoLarisConfigured) {
    return {
      allowed: false,
      code: "AUTOLARIS_UNCONFIGURED",
      message: "Pembayaran online belum dikonfigurasi.",
    };
  }
  if (input.policy.disabledAutoLarisChannels.has(input.autoLarisChannel)) {
    return {
      allowed: false,
      code: "PAYMENT_CHANNEL_DISABLED",
      message: "Channel pembayaran yang dipilih sedang tidak tersedia.",
    };
  }
  return { allowed: true };
}
