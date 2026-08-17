import assert from "node:assert/strict";
import test from "node:test";
import {
  isAutoLarisChannelEnabled,
  isAutoLarisPaymentMethod,
  parseDisabledAutoLarisChannels,
} from "./payment-availability.ts";

test("only provider-backed methods require AutoLaris", () => {
  assert.equal(isAutoLarisPaymentMethod("bank_transfer"), true);
  assert.equal(isAutoLarisPaymentMethod("qris"), true);
  assert.equal(isAutoLarisPaymentMethod("cod"), false);
  assert.equal(isAutoLarisPaymentMethod("manual_transfer"), false);
});

test("disabled AutoLaris channels fail closed", () => {
  const disabledAutoLarisChannels = parseDisabledAutoLarisChannels(
    " VABCA, qris, VABCA ",
  );
  const availability = {
    codEnabled: true,
    autoLarisEnabled: true,
    disabledAutoLarisChannels,
  };

  assert.equal(isAutoLarisChannelEnabled(availability, "VABCA"), false);
  assert.equal(isAutoLarisChannelEnabled(availability, "QRIS"), false);
  assert.equal(isAutoLarisChannelEnabled(availability, "VAMANDIRI"), true);
  assert.deepEqual([...disabledAutoLarisChannels], ["VABCA", "QRIS"]);
});

test("AutoLaris master switch disables every checkout channel", () => {
  const availability = {
    codEnabled: true,
    autoLarisEnabled: false,
    disabledAutoLarisChannels: new Set<string>(),
  };

  assert.equal(isAutoLarisChannelEnabled(availability, "QRIS"), false);
  assert.equal(isAutoLarisChannelEnabled(availability, "VABRI"), false);
});
