/** Galleries and feature images for repair service pages. */

export const CONTROLLER_KIT_IMAGE = "/controller/controller-kit.webp";
/** Temporary stand-in until `controller-kit.webp` is added. */
export const CONTROLLER_KIT_FALLBACK = "/controller/controller4.webp";

export function controllerKitImage(): string {
  return CONTROLLER_KIT_IMAGE;
}

export const serviceGalleries: Record<string, string[]> = {
  "hdmi-repair": [
    "/hdmi/hdmi1.avif",
    "/hdmi/hdmi2.jpg",
    "/hdmi/hdmi3.jpg",
    "/hdmi/hdmi4.jpg",
  ],
  "controller-repair": [
    "/controller/controller1.webp",
    "/controller/controller2.webp",
    "/controller/controller3.webp",
    "/controller/controller4.webp",
    "/controller/controller5.jpeg",
    "/controller/controller6.jpeg",
    "/controller/controller7.jpeg",
    "/controller/drift1.webp",
    "/controller/drift2.webp",
    "/controller/drift3.webp",
  ],
  "ps5-repair": [
    "/ps5repair/ps5-repair1.jpg",
    "/ps5repair/ps5-repair2.webp",
    "/ps5repair/ps5repair1.webp",
    "/ps5repair/ps5-fan.jpg",
  ],
  "ps4-repair": [
    "/ps4repair/fan1.png",
    "/ps4repair/fan2.png",
    "/ps4repair/fan3.png",
  ],
  "xbox-repair": [
    "/xboxrepair/xboxfanrepair.png",
    "/xboxrepair/xboxfanrepair1.jpg",
    "/xboxrepair/xboxfanrepair2.png",
    "/xboxrepair/xboxfanrepair3.png",
  ],
};

export const serviceIssueImages: Record<string, string> = {
  // HDMI service issues
  "console-no-video-signal": "/hdmi/hdmi1.avif",
  "console-screen-flickering": "/hdmi/hdmi2.jpg",
  "console-hdmi-port-broken": "/hdmi/hdmi3.jpg",
  "console-monitor-not-detected": "/hdmi/hdmi4.jpg",
  "console-black-screen": "/hdmi/hdmi1.avif",
  "console-hdmi-loose-port": "/hdmi/hdmi2.jpg",

  // Controller
  "controller-analog-drift": "/controller/drift1.webp",
  "controller-buttons-not-working": CONTROLLER_KIT_IMAGE,
  "controller-not-charging": "/controller/controller2.webp",
  "controller-connection-dropping": "/controller/controller3.webp",
  "controller-analog-stick-broken": "/controller/drift2.webp",

  // PS5
  "ps5-loud-fan-noise": "/ps5repair/ps5-fan.jpg",
  "ps5-overheating": "/ps5repair/ps5-fan.jpg",
  "ps5-not-turning-on": "/ps5repair/ps5-repair1.jpg",
  "ps5-hdmi-port-damage": "/hdmi/hdmi1.avif",
  "ps5-random-shutdown": "/ps5repair/ps5-repair2.webp",
  "ps5-dualsense-controller-problem": "/controller/controller1.webp",

  // PS4
  "ps4-loud-fan-noise": "/ps4repair/fan1.png",
  "ps4-overheating": "/ps4repair/fan2.png",
  "ps4-not-turning-on": "/ps4repair/fan3.png",
  "ps4-hdmi-port-damage": "/hdmi/hdmi2.jpg",

  // Xbox
  "xbox-loud-fan-noise": "/xboxrepair/xboxfanrepair.png",
  "xbox-overheating": "/xboxrepair/xboxfanrepair1.jpg",
  "xbox-not-turning-on": "/xboxrepair/xboxfanrepair2.png",
  "xbox-hdmi-port-damage": "/hdmi/hdmi3.jpg",
  "xbox-power-supply-problem": "/xboxrepair/xboxfanrepair3.png",
};

export function getServiceGallery(slug: string): string[] {
  return serviceGalleries[slug] ?? [];
}

export function getServiceIssueImage(issueSlug: string): string | undefined {
  return serviceIssueImages[issueSlug];
}
