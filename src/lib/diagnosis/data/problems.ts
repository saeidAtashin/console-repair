import type { Complexity, Problem, ProblemFlag } from "../types";

function problem(
  id: string,
  categoryId: string,
  label: string,
  complexity: Complexity,
  sortOrder: number,
  flags?: ProblemFlag[],
  extra?: Partial<Problem>,
): Problem {
  return {
    id,
    categoryId,
    label,
    complexity,
    sortOrder,
    flags,
    ...extra,
  };
}

export const problems: Problem[] = [
  problem("power-no-power", "power", "روشن نمی‌شود", "medium", 10),
  problem("power-on-off", "power", "روشن می‌شود و خاموش می‌شود", "medium", 20),
  problem("power-random-off", "power", "خودبه‌خود خاموش می‌شود", "medium", 30),
  problem("power-restart", "power", "ریستارت می‌شود", "medium", 40),
  problem("power-odd-light", "power", "چراغ غیرعادی دارد", "simple", 50),
  problem("power-beep", "power", "صدای بوق غیرعادی دارد", "simple", 60),
  problem("power-after-outage", "power", "بعد از قطع برق روشن نمی‌شود", "medium", 70),
  problem("power-after-surge", "power", "بعد از نوسان برق روشن نمی‌شود", "complex", 80),
  problem("power-burn-smell", "power", "بوی سوختگی می‌دهد", "complex", 90, ["skip-troubleshooting"]),
  problem("power-other", "power", "مشکل دیگری دارم", "simple", 100, ["misc"]),

  problem("display-no-picture", "display", "تصویر ندارم", "medium", 10),
  problem("display-no-signal", "display", "No Signal", "medium", 20, undefined, {
    conditions: [{ field: "capability", key: "hdmi", op: "eq", value: true }],
  }),
  problem("display-intermittent", "display", "تصویر قطع و وصل می‌شود", "medium", 30),
  problem("display-black", "display", "صفحه سیاه است", "medium", 40),
  problem("display-corrupt", "display", "تصویر خراب است", "medium", 50),
  problem("display-color", "display", "رنگ‌ها مشکل دارند", "simple", 60),
  problem("display-4k", "display", "4K کار نمی‌کند", "simple", 70, undefined, {
    conditions: [{ field: "capability", key: "hdmi", op: "eq", value: true }],
  }),
  problem("display-120hz", "display", "120Hz کار نمی‌کند", "simple", 80, undefined, {
    conditions: [{ field: "capability", key: "hdmi", op: "eq", value: true }],
  }),
  problem("display-hdr", "display", "HDR مشکل دارد", "simple", 90, undefined, {
    conditions: [{ field: "capability", key: "hdmi", op: "eq", value: true }],
  }),
  problem("display-drops", "display", "تصویر بعد از مدتی قطع می‌شود", "medium", 100),
  problem("display-hdmi-damaged", "display", "پورت HDMI آسیب دیده", "complex", 110, ["physical"], {
    conditions: [{ field: "capability", key: "hdmi", op: "eq", value: true }],
  }),
  problem("display-hdmi-cable", "display", "کابل HDMI مشکل دارد", "simple", 120, undefined, {
    conditions: [{ field: "capability", key: "hdmi", op: "eq", value: true }],
  }),
  problem("display-other", "display", "مشکل دیگری دارم", "simple", 130, ["misc"]),

  problem("heat-too-hot", "overheating", "خیلی داغ می‌شود", "medium", 10),
  problem("heat-loud-fan", "overheating", "فن خیلی صدا می‌دهد", "simple", 20),
  problem("heat-fan-dead", "overheating", "فن کار نمی‌کند", "medium", 30),
  problem("heat-shutdown", "overheating", "خودش خاموش می‌شود", "medium", 40),
  problem("heat-warning", "overheating", "هشدار دما می‌دهد", "simple", 50),
  problem("heat-after-while", "overheating", "بعد از مدتی خاموش می‌شود", "medium", 60),
  problem("heat-heavy-game", "overheating", "هنگام بازی سنگین داغ می‌شود", "simple", 70),
  problem("heat-odd-sound", "overheating", "صدای غیرعادی فن دارد", "simple", 80),
  problem("heat-no-service", "overheating", "مدت زیادی سرویس نشده", "simple", 90),
  problem("heat-other", "overheating", "مشکل دیگری دارم", "simple", 100, ["misc"]),

  problem("disc-not-read", "disc", "دیسک را نمی‌خواند", "medium", 10),
  problem("disc-not-in", "disc", "دیسک وارد نمی‌شود", "medium", 20),
  problem("disc-not-out", "disc", "دیسک خارج نمی‌شود", "medium", 30),
  problem("disc-stuck", "disc", "دیسک گیر کرده", "medium", 40),
  problem("disc-sometimes", "disc", "دیسک را فقط گاهی می‌خواند", "medium", 50),
  problem("disc-noise", "disc", "درایو صدای غیرعادی دارد", "medium", 60),
  problem("disc-scratch", "disc", "دیسک را خط می‌اندازد", "medium", 70),

  problem("controller-drift", "controller", "دریفت", "simple", 10),
  problem("controller-button-dead", "controller", "دکمه کار نمی‌کند", "simple", 20),
  problem("controller-button-stick", "controller", "دکمه گیر می‌کند", "simple", 30),
  problem("controller-analog", "controller", "آنالوگ مشکل دارد", "simple", 40),
  problem("controller-l1r1", "controller", "L1 / R1", "simple", 50),
  problem("controller-l2r2", "controller", "L2 / R2", "simple", 60),
  problem("controller-no-charge", "controller", "شارژ نمی‌شود", "medium", 70),
  problem("controller-battery", "controller", "باتری زود خالی می‌شود", "simple", 80),
  problem("controller-no-connect", "controller", "وصل نمی‌شود", "medium", 90),
  problem("controller-dropouts", "controller", "قطع و وصل می‌شود", "medium", 100),
  problem("controller-vibration", "controller", "Vibration کار نمی‌کند", "simple", 110, undefined, {
    conditions: [
      {
        any: [
          { field: "deviceKind", op: "eq", value: "console" },
          { field: "capability", key: "vibration", op: "eq", value: true },
        ],
      },
    ],
  }),
  problem("controller-touchpad", "controller", "Touchpad کار نمی‌کند", "simple", 120, undefined, {
    conditions: [
      {
        any: [
          { field: "deviceKind", op: "eq", value: "console" },
          { field: "capability", key: "touchpad", op: "eq", value: true },
        ],
      },
    ],
  }),
  problem("controller-usb", "controller", "USB کار نمی‌کند", "simple", 130),
  problem("controller-impact", "controller", "ضربه خورده", "medium", 140, ["physical"]),
  problem("controller-liquid", "controller", "آب خورده", "complex", 150, ["liquid", "skip-troubleshooting"]),

  problem("audio-none", "audio", "صدا ندارم", "simple", 10),
  problem("audio-drop", "audio", "صدا قطع و وصل می‌شود", "simple", 20),
  problem("audio-static", "audio", "صدای خش دارد", "simple", 30),
  problem("audio-weak", "audio", "صدا ضعیف است", "simple", 40),
  problem("audio-headset", "audio", "Headset شناسایی نمی‌شود", "simple", 50),
  problem("audio-hdmi", "audio", "HDMI Audio مشکل دارد", "simple", 60, undefined, {
    conditions: [{ field: "capability", key: "hdmi", op: "eq", value: true }],
  }),
  problem("audio-controller", "audio", "صدای دسته مشکل دارد", "simple", 70),

  problem("network-wifi-fail", "network", "Wi-Fi وصل نمی‌شود", "simple", 10),
  problem("network-wifi-drop", "network", "Wi-Fi قطع و وصل می‌شود", "simple", 20),
  problem("network-lan", "network", "LAN کار نمی‌کند", "simple", 30, undefined, {
    conditions: [{ field: "capability", key: "ethernet", op: "eq", value: true }],
  }),
  problem("network-nat", "network", "NAT Error", "simple", 40),
  problem("network-dns", "network", "DNS Error", "simple", 50),
  problem("network-psn", "network", "PSN Error", "simple", 60, undefined, {
    conditions: [{ field: "brandId", op: "eq", value: "sony" }],
  }),
  problem("network-xbox", "network", "Xbox Network Error", "simple", 70, undefined, {
    conditions: [{ field: "brandId", op: "eq", value: "microsoft" }],
  }),
  problem("network-slow", "network", "سرعت دانلود پایین", "simple", 80),
  problem("network-lost", "network", "Connection Lost", "simple", 90),

  problem("storage-not-detected", "storage", "حافظه شناسایی نمی‌شود", "medium", 10),
  problem("storage-full", "storage", "فضا پر است", "simple", 20),
  problem("storage-install-fail", "storage", "بازی نصب نمی‌شود", "simple", 30),
  problem("storage-game-fail", "storage", "بازی اجرا نمی‌شود", "medium", 40),
  problem("storage-error", "storage", "Storage Error", "medium", 50),
  problem("storage-corrupt", "storage", "Corrupted Data", "medium", 60),
  problem("storage-slow", "storage", "دستگاه کند شده", "simple", 70),
  problem("storage-load", "storage", "Load طولانی", "simple", 80),
  problem("storage-crash", "storage", "Crash", "medium", 90),

  problem("error-code", "error", "کد خطا دارم", "medium", 10),
  problem("error-boot", "error", "هنگام روشن شدن خطا می‌دهد", "medium", 20),
  problem("error-game", "error", "هنگام بازی خطا می‌دهد", "simple", 30),
  problem("error-update", "error", "خطای آپدیت", "simple", 40, ["software"]),
  problem("error-other", "error", "مشکل دیگری دارم", "simple", 50, ["misc"]),

  problem("software-game-fail", "software", "بازی اجرا نمی‌شود", "simple", 10, ["software"]),
  problem("software-crash", "software", "بازی Crash می‌کند", "simple", 20, ["software"]),
  problem("software-update", "software", "System Update Error", "medium", 30, ["software"]),
  problem("software-bootloop", "software", "Boot Loop", "complex", 40, ["software"]),
  problem("software-safemode", "software", "Safe Mode", "medium", 50, ["software"]),
  problem("software-system", "software", "System Error", "medium", 60, ["software"]),
  problem("software-corrupt", "software", "Corrupted Data", "medium", 70, ["software"]),
  problem("software-login", "software", "Login Error", "simple", 80, ["software"]),

  problem("usb-dead", "usb", "USB کار نمی‌کند", "simple", 10),
  problem("usb-drop", "usb", "USB قطع و وصل می‌شود", "simple", 20),
  problem("usb-not-detected", "usb", "دستگاه USB شناسایی نمی‌شود", "simple", 30),
  problem("usb-broken", "usb", "پورت شکسته", "complex", 40, ["physical", "skip-troubleshooting"]),
  problem("usb-loose", "usb", "پورت لق است", "medium", 50, ["physical"]),

  problem("physical-hit", "physical-damage", "ضربه خورده", "complex", 10, ["physical"]),
  problem("physical-drop", "physical-damage", "افتاده", "complex", 20, ["physical"]),
  problem("physical-case", "physical-damage", "بدنه شکسته", "complex", 30, ["physical", "skip-troubleshooting"]),
  problem("physical-port", "physical-damage", "پورت شکسته", "complex", 40, ["physical", "skip-troubleshooting"]),
  problem("physical-loose", "physical-damage", "قطعه لق شده", "medium", 50, ["physical"]),
  problem("physical-hdmi", "physical-damage", "پورت HDMI شکسته", "complex", 60, ["physical", "skip-troubleshooting"], {
    conditions: [{ field: "capability", key: "hdmi", op: "eq", value: true }],
  }),

  problem("liquid-spill", "liquid-damage", "مایع وارد دستگاه شده", "complex", 10, ["liquid", "skip-troubleshooting"]),

  problem("misc-other", "misc", "مشکل را توضیح می‌دهم", "simple", 10, ["misc"]),
];
