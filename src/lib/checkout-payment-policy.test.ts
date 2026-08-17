import assert from "node:assert/strict";
import test from "node:test";
import {
  checkCheckoutPaymentAvailability,
  parseDisabledAutoLarisChannels,
  type StoreCheckoutPaymentPolicy,
} from "./checkout-payment-policy.ts";

const enabledPolicy: StoreCheckoutPaymentPolicy = {
  codEnabled: true,
  autoLarisEnabled: true,
  disabledAutoLarisChannels: new Set(),
};

test("checkout rejects payment methods disabled by store policy", () => {
  assert.deepEqual(
    checkCheckoutPaymentAvailability({
      policy: { ...enabledPolicy, codEnabled: false },
      paymentMethod: "cod",
      autoLarisChannel: null,
      autoLarisConfigured: true,
    }),
    {
      allowed: false,
      code: "COD_DISABLED",
      message: "Pembayaran COD sedang tidak tersedia.",
    },
  );

  assert.equal(
    checkCheckoutPaymentAvailability({
      policy: {
        ...enabledPolicy,
        disabledAutoLarisChannels: new Set(["VABCA"]),
      },
      paymentMethod: "bank_transfer",
      autoLarisChannel: "VABCA",
      autoLarisConfigured: true,
    }).allowed,
    false,
  );
});

test("manual transfer does not depend on AutoLaris availability", () => {
  assert.deepEqual(
    checkCheckoutPaymentAvailability({
      policy: { ...enabledPolicy, autoLarisEnabled: false },
      paymentMethod: "manual_transfer",
      autoLarisChannel: null,
      autoLarisConfigured: false,
    }),
    { allowed: true },
  );
});

test("online channels require enabled and configured AutoLaris", () => {
  assert.equal(
    checkCheckoutPaymentAvailability({
      policy: { ...enabledPolicy, autoLarisEnabled: false },
      paymentMethod: "qris",
      autoLarisChannel: "QRIS",
      autoLarisConfigured: true,
    }).allowed,
    false,
  );
  assert.equal(
    checkCheckoutPaymentAvailability({
      policy: enabledPolicy,
      paymentMethod: "qris",
      autoLarisChannel: "QRIS",
      autoLarisConfigured: false,
    }).allowed,
    false,
  );
});

test("disabled channel list is normalized from its persisted format", () => {
  assert.deepEqual(
    [...parseDisabledAutoLarisChannels(" qris ,VABCA,,")],
    ["QRIS", "VABCA"],
  );
  assert.equal(parseDisabledAutoLarisChannels("").size, 0);
});
