import type { Rule } from "../types";

export const rules: Rule[] = [
  {
    id: "power-untested-cable",
    causeId: "power-cable",
    weight: 7,
    action: "self-help",
    conditions: [
      { field: "categoryId", op: "eq", value: "power" },
      { field: "answer", questionId: "power-other-cable", op: "in", value: ["no", "none"] },
    ],
  },
  {
    id: "power-untested-outlet",
    causeId: "power-cable",
    weight: 6,
    action: "self-help",
    conditions: [
      { field: "categoryId", op: "eq", value: "power" },
      { field: "answer", questionId: "power-other-outlet", op: "eq", value: "no" },
    ],
  },
  {
    id: "power-nothing-after-tests",
    causeId: "psu-failure",
    weight: 9,
    action: "repair",
    conditions: [
      { field: "problemId", op: "eq", value: "power-no-power" },
      { field: "answer", questionId: "power-what-happens", op: "eq", value: "nothing" },
      { field: "answer", questionId: "power-other-cable", op: "eq", value: "yes" },
    ],
  },
  {
    id: "power-blink-beep",
    causeId: "power-board",
    weight: 8,
    action: "repair",
    conditions: [
      { field: "categoryId", op: "eq", value: "power" },
      {
        any: [
          { field: "answer", questionId: "power-what-happens", op: "in", value: ["blink", "beep"] },
          { field: "answer", questionId: "power-beep-count", op: "in", value: ["one", "many"] },
        ],
      },
    ],
  },
  {
    id: "power-surge",
    causeId: "power-board",
    weight: 9,
    action: "repair",
    conditions: [
      {
        any: [
          { field: "problemId", op: "in", value: ["power-after-surge", "power-after-outage"] },
          { field: "answer", questionId: "onset", op: "in", value: ["surge", "outage"] },
        ],
      },
      { field: "categoryId", op: "eq", value: "power" },
    ],
  },
  {
    id: "power-burn",
    causeId: "psu-failure",
    weight: 10,
    action: "repair",
    conditions: [{ field: "problemId", op: "eq", value: "power-burn-smell" }],
  },
  {
    id: "power-controller-wakes",
    causeId: "unclear",
    weight: 4,
    action: "consult",
    conditions: [
      { field: "answer", questionId: "power-controller-tried", op: "eq", value: "works" },
    ],
  },

  {
    id: "display-untested-cable",
    causeId: "hdmi-cable",
    weight: 7,
    action: "self-help",
    conditions: [
      { field: "categoryId", op: "eq", value: "display" },
      { field: "answer", questionId: "display-other-hdmi", op: "in", value: ["no", "none"] },
    ],
  },
  {
    id: "display-wiggle",
    causeId: "hdmi-port",
    weight: 9,
    action: "repair",
    conditions: [
      { field: "answer", questionId: "display-wiggle", op: "eq", value: "yes" },
    ],
  },
  {
    id: "display-port-visual",
    causeId: "hdmi-port",
    weight: 10,
    action: "repair",
    conditions: [
      {
        any: [
          { field: "answer", questionId: "display-hdmi-visual", op: "eq", value: "yes" },
          { field: "problemId", op: "eq", value: "display-hdmi-damaged" },
        ],
      },
    ],
  },
  {
    id: "display-after-impact",
    causeId: "hdmi-port",
    weight: 8,
    action: "repair",
    conditions: [
      { field: "answer", questionId: "display-after-impact", op: "eq", value: "yes" },
    ],
  },
  {
    id: "display-no-signal-tested",
    causeId: "hdmi-port",
    weight: 8,
    action: "repair",
    conditions: [
      { field: "categoryId", op: "eq", value: "display" },
      { field: "answer", questionId: "display-no-signal-msg", op: "eq", value: "yes" },
      { field: "answer", questionId: "display-other-hdmi", op: "eq", value: "yes" },
    ],
  },
  {
    id: "display-has-sound-no-picture",
    causeId: "hdmi-port",
    weight: 7,
    action: "repair",
    conditions: [
      { field: "answer", questionId: "display-has-sound", op: "eq", value: "yes" },
      {
        field: "problemId",
        op: "in",
        value: ["display-no-picture", "display-no-signal", "display-black"],
      },
    ],
  },
  {
    id: "display-cable-problem",
    causeId: "hdmi-cable",
    weight: 8,
    action: "self-help",
    conditions: [{ field: "problemId", op: "eq", value: "display-hdmi-cable" }],
  },
  {
    id: "display-4k-settings",
    causeId: "display-settings",
    weight: 6,
    action: "self-help",
    conditions: [
      { field: "problemId", op: "in", value: ["display-4k", "display-120hz", "display-hdr"] },
    ],
  },

  {
    id: "heat-never-serviced",
    causeId: "dust-thermal",
    weight: 8,
    action: "repair",
    conditions: [
      { field: "categoryId", op: "eq", value: "overheating" },
      { field: "answer", questionId: "heat-last-service", op: "in", value: ["never", "years"] },
    ],
  },
  {
    id: "heat-fan-dead",
    causeId: "fan-failure",
    weight: 9,
    action: "repair",
    conditions: [
      {
        any: [
          { field: "problemId", op: "eq", value: "heat-fan-dead" },
          { field: "answer", questionId: "heat-fan-fast", op: "eq", value: "no" },
        ],
      },
    ],
  },
  {
    id: "heat-enclosed",
    causeId: "placement-heat",
    weight: 6,
    action: "self-help",
    conditions: [
      { field: "answer", questionId: "heat-enclosed", op: "eq", value: "yes" },
    ],
  },
  {
    id: "heat-no-clearance",
    causeId: "placement-heat",
    weight: 5,
    action: "self-help",
    conditions: [
      { field: "answer", questionId: "heat-clearance", op: "eq", value: "no" },
    ],
  },
  {
    id: "heat-shutdown",
    causeId: "dust-thermal",
    weight: 7,
    action: "repair",
    conditions: [
      { field: "answer", questionId: "heat-shuts-down", op: "eq", value: "yes" },
    ],
  },

  {
    id: "disc-one-disc",
    causeId: "disc-media",
    weight: 7,
    action: "self-help",
    conditions: [
      { field: "answer", questionId: "disc-all-discs", op: "eq", value: "no" },
    ],
  },
  {
    id: "disc-mechanism",
    causeId: "disc-drive",
    weight: 8,
    action: "repair",
    conditions: [
      { field: "categoryId", op: "eq", value: "disc" },
      {
        any: [
          { field: "answer", questionId: "disc-inserts", op: "eq", value: "no" },
          { field: "answer", questionId: "disc-ejects", op: "eq", value: "no" },
          { field: "answer", questionId: "disc-spins", op: "eq", value: "no" },
          { field: "problemId", op: "in", value: ["disc-stuck", "disc-not-in", "disc-not-out"] },
        ],
      },
    ],
  },
  {
    id: "disc-noise-all",
    causeId: "disc-drive",
    weight: 7,
    action: "repair",
    conditions: [
      { field: "answer", questionId: "disc-odd-sound", op: "eq", value: "yes" },
      { field: "answer", questionId: "disc-all-discs", op: "neq", value: "no" },
    ],
  },

  {
    id: "controller-drift",
    causeId: "analog-stick",
    weight: 9,
    action: "repair",
    conditions: [
      {
        field: "problemId",
        op: "in",
        value: ["controller-drift", "controller-analog"],
      },
    ],
  },
  {
    id: "controller-moves-alone",
    causeId: "analog-stick",
    weight: 10,
    action: "repair",
    conditions: [
      { field: "answer", questionId: "controller-moves-alone", op: "eq", value: "yes" },
    ],
  },
  {
    id: "controller-buttons",
    causeId: "controller-buttons",
    weight: 8,
    action: "repair",
    conditions: [
      {
        field: "problemId",
        op: "in",
        value: [
          "controller-button-dead",
          "controller-button-stick",
          "controller-l1r1",
          "controller-l2r2",
          "controller-touchpad",
          "controller-vibration",
        ],
      },
    ],
  },
  {
    id: "controller-battery",
    causeId: "controller-battery",
    weight: 7,
    action: "repair",
    conditions: [
      {
        field: "problemId",
        op: "in",
        value: ["controller-no-charge", "controller-battery"],
      },
      { field: "answer", questionId: "controller-charge-cable", op: "eq", value: "yes" },
    ],
  },
  {
    id: "controller-untested-cable",
    causeId: "controller-wireless",
    weight: 6,
    action: "self-help",
    conditions: [
      { field: "answer", questionId: "controller-charge-cable", op: "in", value: ["no", "none"] },
    ],
  },
  {
    id: "controller-connect",
    causeId: "controller-wireless",
    weight: 5,
    action: "self-help",
    conditions: [
      {
        field: "problemId",
        op: "in",
        value: ["controller-no-connect", "controller-dropouts"],
      },
    ],
  },

  {
    id: "audio-settings",
    causeId: "audio-settings",
    weight: 6,
    action: "self-help",
    conditions: [
      { field: "categoryId", op: "eq", value: "audio" },
      {
        any: [
          { field: "answer", questionId: "audio-settings", op: "eq", value: "yes" },
          { field: "answer", questionId: "audio-one-game", op: "eq", value: "yes" },
        ],
      },
    ],
  },
  {
    id: "audio-hardware",
    causeId: "audio-hardware",
    weight: 6,
    action: "consult",
    conditions: [
      { field: "categoryId", op: "eq", value: "audio" },
      { field: "answer", questionId: "audio-has-picture", op: "eq", value: "yes" },
      { field: "answer", questionId: "audio-where", op: "eq", value: "both" },
    ],
  },

  {
    id: "network-home",
    causeId: "network-home",
    weight: 8,
    action: "self-help",
    conditions: [
      { field: "answer", questionId: "network-others-ok", op: "eq", value: "no" },
    ],
  },
  {
    id: "network-online",
    causeId: "online-service",
    weight: 7,
    action: "monitor",
    conditions: [
      { field: "answer", questionId: "network-online-only", op: "eq", value: "yes" },
      { field: "answer", questionId: "network-others-ok", op: "eq", value: "yes" },
    ],
  },
  {
    id: "network-console",
    causeId: "network-console",
    weight: 7,
    action: "consult",
    conditions: [
      { field: "categoryId", op: "eq", value: "network" },
      { field: "answer", questionId: "network-others-ok", op: "eq", value: "yes" },
      { field: "answer", questionId: "network-hotspot", op: "eq", value: "yes" },
    ],
  },

  {
    id: "storage-full",
    causeId: "storage-full",
    weight: 8,
    action: "self-help",
    conditions: [
      {
        any: [
          { field: "problemId", op: "eq", value: "storage-full" },
          { field: "answer", questionId: "storage-free-space", op: "in", value: ["none", "little"] },
        ],
      },
    ],
  },
  {
    id: "storage-hw",
    causeId: "storage-hardware",
    weight: 8,
    action: "repair",
    conditions: [
      {
        field: "problemId",
        op: "in",
        value: ["storage-not-detected", "storage-error"],
      },
    ],
  },

  {
    id: "software-one-game",
    causeId: "software-game",
    weight: 8,
    action: "self-help",
    conditions: [
      { field: "answer", questionId: "software-one-game", op: "eq", value: "yes" },
    ],
  },
  {
    id: "software-system",
    causeId: "software-system",
    weight: 7,
    action: "self-help",
    conditions: [
      { field: "flag", op: "eq", value: "software" },
    ],
  },

  {
    id: "usb-visual",
    causeId: "usb-port",
    weight: 9,
    action: "repair",
    conditions: [
      {
        any: [
          { field: "answer", questionId: "usb-visual-damage", op: "eq", value: "yes" },
          { field: "problemId", op: "in", value: ["usb-broken", "usb-loose"] },
        ],
      },
    ],
  },
  {
    id: "usb-after-hit",
    causeId: "usb-port",
    weight: 8,
    action: "repair",
    conditions: [
      { field: "answer", questionId: "usb-after-impact", op: "eq", value: "yes" },
    ],
  },

  {
    id: "physical",
    causeId: "physical-internal",
    weight: 9,
    action: "repair",
    conditions: [{ field: "flag", op: "eq", value: "physical" }],
  },
  {
    id: "physical-no-power",
    causeId: "physical-internal",
    weight: 10,
    action: "repair",
    conditions: [
      { field: "answer", questionId: "physical-powers-on", op: "eq", value: "no" },
    ],
  },

  {
    id: "liquid",
    causeId: "liquid-corrosion",
    weight: 10,
    action: "repair",
    conditions: [{ field: "flag", op: "eq", value: "liquid" }],
  },

  {
    id: "misc",
    causeId: "unclear",
    weight: 3,
    action: "consult",
    conditions: [{ field: "flag", op: "eq", value: "misc" }],
  },
];
