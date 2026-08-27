import type { Capabilities } from "../types";

export const CONSOLE_CAPABILITIES: Capabilities = {
  discDrive: true,
  hdmi: true,
  display: true,
  usb: true,
  wifi: true,
  ethernet: true,
  analogSticks: false,
  touchpad: false,
  vibration: false,
  battery: false,
  fan: true,
};

export const DIGITAL_CONSOLE: Partial<Capabilities> = {
  discDrive: false,
};

export const HANDHELD_CAPABILITIES: Capabilities = {
  discDrive: false,
  hdmi: true,
  display: true,
  usb: true,
  wifi: true,
  ethernet: false,
  analogSticks: false,
  touchpad: false,
  vibration: false,
  battery: false,
  fan: true,
};

export const CONTROLLER_CAPABILITIES: Capabilities = {
  discDrive: false,
  hdmi: false,
  display: false,
  usb: true,
  wifi: true,
  ethernet: false,
  analogSticks: true,
  touchpad: false,
  vibration: true,
  battery: true,
  fan: false,
};

export function withCapabilities(
  base: Capabilities,
  overrides: Partial<Capabilities> = {},
): Capabilities {
  return { ...base, ...overrides };
}
