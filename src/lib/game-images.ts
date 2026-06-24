export const GAME_IMAGE_BASE = "/gameimages";

/** Prefer .webp for new assets — smaller files and faster optimization. */
const img = (filename: string) => `${GAME_IMAGE_BASE}/${filename}`;

/** Canonical game key → ordered local image paths */
const GAME_IMAGE_MAP: Record<string, readonly string[]> = {
  "astros-playroom": [
    img("Astro\u2019s Playroom.jfif"),
    img("Astro\u2019s Playroom2.jpg"),
  ],
  "baldurs-gate-3": [img("Baldur\u2019s Gate 31.jfif")],
  bloodborne: [img("Bloodborne1.jfif"), img("Bloodborne2.jpg")],
  "call-of-duty-modern-warfare-iii": [
    img("Call of DutyModern Warfare III.jfif"),
    img("Call of DutyModern Warfare III2.jpg"),
  ],
  celeste: [img("Celeste1.jfif")],
  "cyberpunk-2077": [
    img("Cyberpunk 20771.jpg"),
    img("Cyberpunk 20772.jfif"),
  ],
  "ea-sports-fc-25": [img("EA Sports FC 25.jpg")],
  "elden-ring": [img("eldenring1.jfif"), img("eldenring2.jpeg")],
  fortnite: [img("Fortnite1.jpg"), img("Fortnite2.jpg")],
  "forza-horizon-5": [
    img("Forza Horizon 5.jfif"),
    img("Forza Horizon 52.jpg"),
  ],
  "gears-5": [img("Gears 51.jfif"), img("Gears 52.jpg")],
  "ghost-of-tsushima": [
    img("Ghost of Tsushima1.jfif"),
    img("Ghost of Tsushima2.jpg"),
  ],
  "god-of-war-ragnarok": [
    img("godofwarragnarok1.jfif"),
    img("godofwarragnarok2.jpg"),
  ],
  hades: [img("Hades.webp"), img("Hades_cover_art.jpg")],
  "halo-infinite": [img("Halo Infinite1.jfif"), img("Halo Infinite2.jpg")],
  "hogwarts-legacy": [
    img("Hogwarts Legacy1.jfif"),
    img("Hogwarts Legacy2.jpg"),
  ],
  "horizon-forbidden-west": [
    img("HorizonForbiddenWest1.jfif"),
    img("Horizon Forbidden West Standard Edition - PlayStation 5.jpg"),
  ],
  jedi: [img("jedi.jfif"), img("jedi.jpg")],
  "ratchet-clank-rift-apart": [
    img("RatchetClankRift Apart1.jfif"),
    img("RatchetClankRift Apart2.jpg"),
  ],
  returnal: [img("Returnal.jfif"), img("Returnal2.jpg")],
  "rocket-league": [img("Rocket League.jfif"), img("Rocket League2.jpg")],
  "sea-of-thieves": [
    img("Sea of Thieves1.png"),
    img("Sea of Thieves2.jfif"),
    img("Sea of Thieves3.jpg"),
  ],
  "spider-man-2": [
    img("marvelspiderman2-1.jfif"),
    img("marvelspiderman2-2.jpg"),
  ],
  "stardew-valley": [img("Stardew Valley1.jfif")],
  "the-last-of-us-part-ii": [
    img("thelastofus2.jfif"),
    img("The Last of Us Part II PS4.jpg"),
  ],
  "uncharted-4": [img("Uncharted 4.jfif"), img("Uncharted 42.jpg")],
};

const SLUG_ALIASES: Record<string, string> = {
  "gta-v-cheats": "gta-v",
  "gta-online-secrets": "gta-v",
  "minecraft-cheats": "minecraft",
  "sims-4-cheats": "sims-4",
  "rdr2-cheats": "red-dead-redemption-2",
  "skyrim-cheats": "skyrim",
  "lego-harry-potter-cheats": "lego-harry-potter",
  "mortal-kombat-1-cheats": "mortal-kombat-1",
  "witcher-3-cheats": "the-witcher-3",
  "fallout-4-cheats": "fallout-4",
  "ac-valhalla-cheats": "assassins-creed-valhalla",
  "far-cry-6-cheats": "far-cry-6",
  "tekken-8-cheats": "tekken-8",
  "nba-2k25-secrets": "nba-2k25",
  "wwe-2k24-cheats": "wwe-2k24",
  "nfs-unbound-secrets": "need-for-speed-unbound",
  "re4-remake-secrets": "resident-evil-4-remake",
  "crash-trilogy-cheats": "crash-bandicoot-trilogy",
  "astros-playroom-secrets": "astros-playroom",
  "baldurs-gate-3-secrets": "baldurs-gate-3",
  "cod-mw3-secrets": "call-of-duty-modern-warfare-iii",
  "cyberpunk-2077-cheats": "cyberpunk-2077",
  "elden-ring-secrets": "elden-ring",
  "fc-25-secrets": "ea-sports-fc-25",
  "forza-horizon-5-secrets": "forza-horizon-5",
  "fortnite-secrets": "fortnite",
  "god-of-war-ragnarok-secrets": "god-of-war-ragnarok",
  "hades-secrets": "hades",
  "hogwarts-legacy-secrets": "hogwarts-legacy",
  "horizon-fw-secrets": "horizon-forbidden-west",
  "rocket-league-secrets": "rocket-league",
  "spider-man-2-secrets": "spider-man-2",
  "stardew-valley-secrets": "stardew-valley",
  "tlou2-secrets": "the-last-of-us-part-ii",
  "uncharted-4-secrets": "uncharted-4",
  "celeste-secrets": "celeste",
  "marvels-spider-man-2": "spider-man-2",
  "marvel-spider-man-2": "spider-man-2",
  "god-of-war-ragnarok": "god-of-war-ragnarok",
  "horizon-forbidden-west": "horizon-forbidden-west",
  "star-wars-jedi-survivor": "jedi",
  "ratchet-and-clank-rift-apart": "ratchet-clank-rift-apart",
  "ratchet-clank-rift-apart": "ratchet-clank-rift-apart",
  "ghost-of-tsushima": "ghost-of-tsushima",
  "the-last-of-us-part-ii": "the-last-of-us-part-ii",
  "the-last-of-us-part-ii-remastered": "the-last-of-us-part-ii",
  "uncharted-4-a-thiefs-end": "uncharted-4",
  "call-of-duty-modern-warfare-iii": "call-of-duty-modern-warfare-iii",
  "call-of-duty-modern-warfare-3": "call-of-duty-modern-warfare-iii",
};

const NAME_ALIASES: Record<string, string> = {
  "Astro's Playroom": "astros-playroom",
  "Baldur's Gate 3": "baldurs-gate-3",
  Bloodborne: "bloodborne",
  "Call of Duty: Modern Warfare III": "call-of-duty-modern-warfare-iii",
  Celeste: "celeste",
  "Cyberpunk 2077": "cyberpunk-2077",
  "EA Sports FC 25": "ea-sports-fc-25",
  "Elden Ring": "elden-ring",
  Fortnite: "fortnite",
  "Forza Horizon 5": "forza-horizon-5",
  "Gears 5": "gears-5",
  "Ghost of Tsushima": "ghost-of-tsushima",
  "God of War Ragnarök": "god-of-war-ragnarok",
  Hades: "hades",
  "Halo Infinite": "halo-infinite",
  "Hogwarts Legacy": "hogwarts-legacy",
  "Horizon Forbidden West": "horizon-forbidden-west",
  "Marvel's Spider-Man 2": "spider-man-2",
  "Ratchet & Clank: Rift Apart": "ratchet-clank-rift-apart",
  Returnal: "returnal",
  "Rocket League": "rocket-league",
  "Sea of Thieves": "sea-of-thieves",
  "Star Wars Jedi: Survivor": "jedi",
  "Stardew Valley": "stardew-valley",
  "The Last of Us Part II": "the-last-of-us-part-ii",
  "Uncharted 4": "uncharted-4",
  "Uncharted 4: A Thief's End": "uncharted-4",
};

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/_cheats$|-cheats$|-secrets$/, "")
    .trim();
}

function resolveCanonicalKey(slug?: string, name?: string): string | undefined {
  if (slug) {
    const normalized = normalizeSlug(slug);
    if (SLUG_ALIASES[normalized]) return SLUG_ALIASES[normalized];
    if (GAME_IMAGE_MAP[normalized]) return normalized;
  }

  if (name) {
    if (NAME_ALIASES[name]) return NAME_ALIASES[name];
    const fromSlug = normalizeSlug(
      name
        .toLowerCase()
        .replace(/[''`]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    );
    if (SLUG_ALIASES[fromSlug]) return SLUG_ALIASES[fromSlug];
    if (GAME_IMAGE_MAP[fromSlug]) return fromSlug;
  }

  return undefined;
}

export type ResolveGameImagesInput = {
  slug?: string;
  name?: string;
  fallback?: string | null;
};

export type ResolvedGameImages = {
  images: string[];
  coverImage: string | null;
};

export function resolveGameImages({
  slug,
  name,
  fallback = null,
}: ResolveGameImagesInput): ResolvedGameImages {
  const key = resolveCanonicalKey(slug, name);
  const localImages = key ? [...(GAME_IMAGE_MAP[key] ?? [])] : [];

  if (localImages.length > 0) {
    return { images: localImages, coverImage: localImages[0] };
  }

  if (fallback) {
    return { images: [fallback], coverImage: fallback };
  }

  return { images: [], coverImage: null };
}

export function getGameCoverImage(input: ResolveGameImagesInput): string | null {
  return resolveGameImages(input).coverImage;
}
