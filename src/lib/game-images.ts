export const GAME_IMAGE_BASE = "/gameimages";

/** Prefer .webp for new assets — smaller files and faster optimization. */
const img = (filename: string) => `${GAME_IMAGE_BASE}/${filename}`;

/** Canonical game key → ordered local image paths */
const GAME_IMAGE_MAP: Record<string, readonly string[]> = {
  "assassins-creed-valhalla": [
    img("Assassin\u2019s Creed Valhalla1.jfif"),
    img("Assassin\u2019s Creed Valhalla2.jpg"),
    img("Assassin\u2019s Creed Valhalla3.jpg"),
    img("Assassin\u2019s Creed Valhalla4.jpg"),
  ],
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
  "crash-bandicoot-trilogy": [
    img("Crash Bandicoot N Sane Trilogy1.jfif"),
    img("Crash Bandicoot N Sane Trilogy2.jpg"),
    img("Crash Bandicoot N Sane Trilogy3.jpg"),
  ],
  "cyberpunk-2077": [
    img("Cyberpunk 20771.jpg"),
    img("Cyberpunk 20772.jfif"),
  ],
  "ea-sports-fc-25": [img("EA Sports FC 25.jpg")],
  "elden-ring": [img("eldenring1.jfif"), img("eldenring2.jpeg")],
  "fallout-4": [img("Fallout 42.jpg"), img("Fallout 44.jpg")],
  "far-cry-6": [
    img("Far Cry 61.jfif"),
    img("Far Cry 62.jpg"),
    img("Far Cry 63.jpg"),
    img("Far Cry 64.jpg"),
  ],
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
  "gta-online": [img("Grand Theft Auto Online.jfif")],
  "gta-v": [img("Grand Theft Auto V1.jpg"), img("Grand Theft Auto V2.jpg")],
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
  "just-cause-4": [img("Just Cause 4.jfif"), img("Just Cause 42.jpg")],
  "lego-harry-potter": [img("LEGO Harry Potter Collection1.jpg")],
  "mafia-definitive-edition": [img("Mafia Definitive Edition1.jfif")],
  minecraft: [img("Minecraft1.jpg")],
  "mortal-kombat-1": [img("Mortal Kombat 11.jfif")],
  "nba-2k25": [img("NBA 2K25.jfif")],
  "need-for-speed-unbound": [img("Need for Speed Unbound.jfif")],
  "ratchet-clank-rift-apart": [
    img("RatchetClankRift Apart1.jfif"),
    img("RatchetClankRift Apart2.jpg"),
  ],
  "red-dead-redemption-2": [
    img("Red Dead Redemption 2.jfif"),
    img("Red Dead Redemption 23.jpg"),
    img("Red Dead Redemption 24.jpg"),
  ],
  "resident-evil-4-remake": [
    img("Resident Evil 4 Remake1.jfif"),
    img("Resident Evil 4 Remake2.jpg"),
    img("Resident Evil 4 Remake3.jpg"),
  ],
  returnal: [img("Returnal.jfif"), img("Returnal2.jpg")],
  "rocket-league": [img("Rocket League.jfif"), img("Rocket League2.jpg")],
  "saints-row-3": [
    img("Saints RowThe Third Remastere2.jpg"),
    img("Saints RowThe Third Remastered3.jpg"),
  ],
  "sea-of-thieves": [
    img("Sea of Thieves1.png"),
    img("Sea of Thieves2.jfif"),
    img("Sea of Thieves3.jpg"),
  ],
  "sims-4": [img("The Sims 42.jpg"), img("The Sims 43.png")],
  skyrim: [
    img("The Elder Scrolls VSkyrim1.jfif"),
    img("The Elder Scrolls VSkyrim12.png"),
    img("The Elder Scrolls VSkyrim13.jpg"),
  ],
  "spider-man-2": [
    img("marvelspiderman2-1.jfif"),
    img("marvelspiderman2-2.jpg"),
  ],
  "stardew-valley": [img("Stardew Valley1.jfif")],
  "tekken-8": [img("Tekken 81.jfif"), img("Tekken 82.webp")],
  "the-last-of-us-part-ii": [
    img("thelastofus2.jfif"),
    img("The Last of Us Part II PS4.jpg"),
  ],
  "the-witcher-3": [img("The Witcher 3 Wild Hunt1.jfif")],
  "uncharted-4": [img("Uncharted 4.jfif"), img("Uncharted 42.jpg")],
  "watch-dogs-legion": [img("Watch Dogs Legion.jfif")],
  "wwe-2k24": [img("WWE 2K24.jfif")],
};

const SLUG_ALIASES: Record<string, string> = {
  "gta-v-cheats": "gta-v",
  "gta-online-secrets": "gta-online",
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
  "saints-row-3-cheats": "saints-row-3",
  "watch-dogs-legion-cheats": "watch-dogs-legion",
  "mafia-definitive-cheats": "mafia-definitive-edition",
  "just-cause-4-cheats": "just-cause-4",
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
  "Assassin's Creed Valhalla": "assassins-creed-valhalla",
  "Astro's Playroom": "astros-playroom",
  "Baldur's Gate 3": "baldurs-gate-3",
  Bloodborne: "bloodborne",
  "Call of Duty: Modern Warfare III": "call-of-duty-modern-warfare-iii",
  Celeste: "celeste",
  "Crash Bandicoot N. Sane Trilogy": "crash-bandicoot-trilogy",
  "Cyberpunk 2077": "cyberpunk-2077",
  "EA Sports FC 25": "ea-sports-fc-25",
  "Elden Ring": "elden-ring",
  "Fallout 4": "fallout-4",
  "Far Cry 6": "far-cry-6",
  Fortnite: "fortnite",
  "Forza Horizon 5": "forza-horizon-5",
  "Gears 5": "gears-5",
  "Ghost of Tsushima": "ghost-of-tsushima",
  "God of War Ragnarök": "god-of-war-ragnarok",
  "Grand Theft Auto Online": "gta-online",
  "Grand Theft Auto V": "gta-v",
  Hades: "hades",
  "Halo Infinite": "halo-infinite",
  "Hogwarts Legacy": "hogwarts-legacy",
  "Horizon Forbidden West": "horizon-forbidden-west",
  "Just Cause 4": "just-cause-4",
  "LEGO Harry Potter Collection": "lego-harry-potter",
  "Mafia: Definitive Edition": "mafia-definitive-edition",
  "Marvel's Spider-Man 2": "spider-man-2",
  Minecraft: "minecraft",
  "Mortal Kombat 1": "mortal-kombat-1",
  "NBA 2K25": "nba-2k25",
  "Need for Speed Unbound": "need-for-speed-unbound",
  "Ratchet & Clank: Rift Apart": "ratchet-clank-rift-apart",
  "Red Dead Redemption 2": "red-dead-redemption-2",
  "Resident Evil 4 Remake": "resident-evil-4-remake",
  Returnal: "returnal",
  "Rocket League": "rocket-league",
  "Saints Row: The Third Remastered": "saints-row-3",
  "Sea of Thieves": "sea-of-thieves",
  "Star Wars Jedi: Survivor": "jedi",
  "Stardew Valley": "stardew-valley",
  "Tekken 8": "tekken-8",
  "The Elder Scrolls V: Skyrim": "skyrim",
  "The Last of Us Part II": "the-last-of-us-part-ii",
  "The Sims 4": "sims-4",
  "The Witcher 3: Wild Hunt": "the-witcher-3",
  "Uncharted 4": "uncharted-4",
  "Uncharted 4: A Thief's End": "uncharted-4",
  "Watch Dogs: Legion": "watch-dogs-legion",
  "WWE 2K24": "wwe-2k24",
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
