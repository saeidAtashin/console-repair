"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import FlyToListAnimator from "@/app/components/game-install/FlyToListAnimator";
import ShopToast from "@/app/components/shop/ShopToast";
import { useAuth } from "@/app/context/AuthContext";
import type { InstallCatalogGame } from "@/lib/game-install-catalog";
import {
  cacheDeviceTypeId,
  dispatchInstallListChanged,
  draftItemToInstallListGame,
  readCachedDeviceTypeId,
  type InstallListGame,
} from "@/lib/game-install-list";
import {
  addInstallationItem,
  fetchInstallationDevices,
  fetchInstallationDraft,
  matchInstallationDevice,
  removeInstallationItem,
} from "@/lib/installation/api";
import { ensureInstallCatalogIndex } from "@/lib/installation/catalog-client";
import {
  getVisibleListTargetRect,
  isOrderPanelInViewport,
  LIST_RECEIVE_DURATION_MS,
  prefersReducedMotion,
  scrollBackTo,
  scrollToListTarget,
} from "@/lib/game-install/fly-to-list";
import { resolveGameImages } from "@/lib/game-images";
import { ApiError } from "@/lib/api-client";

export type FlyToListAnimationState = {
  gameId: string;
  image: string;
  fromRect: DOMRect;
};

export type AddToGameListOptions = {
  sourceElement?: HTMLElement | null;
};

type GameInstallListContextValue = {
  itemsByConsole: Record<string, InstallListGame[]>;
  draftLoading: boolean;
  toastMessage: string | null;
  flyAnimation: FlyToListAnimationState | null;
  flyingGameId: string | null;
  listBounce: boolean;
  isFlyActive: boolean;
  refreshDraft: () => Promise<void>;
  isInList: (gameId: string, consoleSlug?: string) => boolean;
  addGameWithAnimation: (
    game: InstallCatalogGame,
    consoleSlug: string,
    options?: AddToGameListOptions,
  ) => Promise<boolean>;
  removeGame: (gameId: string, consoleSlug: string) => Promise<void>;
  clearConsoleList: (consoleSlug: string) => Promise<void>;
  dismissToast: () => void;
  completeFlyAnimation: () => void;
};

const GameInstallListContext = createContext<GameInstallListContextValue | null>(
  null,
);

export function GameInstallListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const isLoggedIn = Boolean(user);

  const [itemsByConsole, setItemsByConsole] = useState<
    Record<string, InstallListGame[]>
  >({});
  const [draftLoading, setDraftLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [flyAnimation, setFlyAnimation] = useState<FlyToListAnimationState | null>(
    null,
  );
  const [listBounce, setListBounce] = useState(false);
  const bounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flyActiveRef = useRef(false);
  const pendingScrollYRef = useRef<number | null>(null);
  const hasAutoScrolledForAddRef = useRef(false);
  const draftConsoleSlugRef = useRef<string | null>(null);

  useEffect(() => {
    flyActiveRef.current = flyAnimation !== null;
  }, [flyAnimation]);

  useEffect(() => {
    return () => {
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    };
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const triggerListBounce = useCallback(() => {
    setListBounce(true);
    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    bounceTimerRef.current = setTimeout(() => {
      setListBounce(false);
      bounceTimerRef.current = null;
    }, LIST_RECEIVE_DURATION_MS);
  }, []);

  const completeFlyAnimation = useCallback(() => {
    flyActiveRef.current = false;
    setFlyAnimation(null);
    triggerListBounce();

    const savedY = pendingScrollYRef.current;
    pendingScrollYRef.current = null;
    if (savedY !== null) {
      void scrollBackTo(savedY);
    }
  }, [triggerListBounce]);

  const applyDraftItems = useCallback(
    (consoleSlug: string, items: InstallListGame[]) => {
      setItemsByConsole((prev) => ({ ...prev, [consoleSlug]: items }));
      dispatchInstallListChanged();
    },
    [],
  );

  const refreshDraft = useCallback(async () => {
    if (authLoading) return;
    setDraftLoading(true);
    try {
      const draft = await fetchInstallationDraft({ isLoggedIn });
      if (!draft?.items?.length) {
        setItemsByConsole({});
        dispatchInstallListChanged();
        return;
      }

      const deviceName = draft.device_type?.name?.toLowerCase() ?? "";
      let consoleSlug = draftConsoleSlugRef.current ?? "ps4";
      if (deviceName.includes("ps5") || deviceName.includes("pes5")) {
        consoleSlug = "ps5";
      } else if (deviceName.includes("xbox")) {
        consoleSlug = "xbox-series";
      } else if (deviceName.includes("ps4") || deviceName.includes("pes4")) {
        consoleSlug = "ps4";
      }

      draftConsoleSlugRef.current = consoleSlug;
      const catalogIndex = await ensureInstallCatalogIndex();

      setItemsByConsole((prev) => {
        const existing = prev[consoleSlug] ?? [];
        const mapped = draft.items.map((item) => {
          const gameId = String(item.game.id);
          const prevItem = existing.find((g) => g.id === gameId);
          const catalogEntry = catalogIndex.get(item.game.id);
          return draftItemToInstallListGame(item, consoleSlug, {
            coverImage:
              prevItem?.backgroundImage ?? catalogEntry?.coverImage ?? null,
            size: item.game.size ?? catalogEntry?.size ?? prevItem?.size,
          });
        });
        dispatchInstallListChanged();
        return { ...prev, [consoleSlug]: mapped };
      });
    } catch {
      /* keep existing */
    } finally {
      setDraftLoading(false);
    }
  }, [authLoading, isLoggedIn]);

  useEffect(() => {
    void refreshDraft();
  }, [refreshDraft]);

  const resolveDeviceTypeId = useCallback(
    async (consoleSlug: string): Promise<number> => {
      const cached = readCachedDeviceTypeId(consoleSlug);
      if (cached != null) return cached;

      const devices = await fetchInstallationDevices();
      const device = matchInstallationDevice(devices, consoleSlug);
      if (!device) {
        throw new Error("دستگاه نصب برای این کنسول یافت نشد.");
      }
      cacheDeviceTypeId(consoleSlug, device.id);
      return device.id;
    },
    [],
  );

  const isInList = useCallback(
    (gameId: string, consoleSlug?: string) => {
      if (consoleSlug) {
        return (itemsByConsole[consoleSlug] ?? []).some((g) => g.id === gameId);
      }
      return Object.values(itemsByConsole).some((list) =>
        list.some((g) => g.id === gameId),
      );
    },
    [itemsByConsole],
  );

  const removeGame = useCallback(
    async (gameId: string, consoleSlug: string) => {
      const list = itemsByConsole[consoleSlug] ?? [];
      const target = list.find((g) => g.id === gameId);
      if (!target?.itemId) {
        applyDraftItems(
          consoleSlug,
          list.filter((g) => g.id !== gameId),
        );
        return;
      }

      await removeInstallationItem(target.itemId, isLoggedIn);
      applyDraftItems(
        consoleSlug,
        list.filter((g) => g.id !== gameId),
      );
      void refreshDraft();
    },
    [itemsByConsole, isLoggedIn, applyDraftItems, refreshDraft],
  );

  const clearConsoleList = useCallback(
    async (consoleSlug: string) => {
      const list = itemsByConsole[consoleSlug] ?? [];
      await Promise.all(
        list
          .filter((g) => g.itemId != null)
          .map((g) => removeInstallationItem(g.itemId!, isLoggedIn)),
      );
      applyDraftItems(consoleSlug, []);
      void refreshDraft();
    },
    [itemsByConsole, isLoggedIn, applyDraftItems, refreshDraft],
  );

  const addGameWithAnimation = useCallback(
    async (
      game: InstallCatalogGame,
      consoleSlug: string,
      options?: AddToGameListOptions,
    ): Promise<boolean> => {
      if (flyActiveRef.current) return false;
      if (isInList(game.id, consoleSlug)) return false;

      const apiId = game.apiId ?? Number.parseInt(game.id, 10);
      if (!Number.isFinite(apiId)) {
        setToastMessage("شناسه بازی نامعتبر است.");
        return false;
      }

      try {
        const deviceTypeId = await resolveDeviceTypeId(consoleSlug);
        draftConsoleSlugRef.current = consoleSlug;
        const result = await addInstallationItem(
          { game: apiId, device_type: deviceTypeId },
          isLoggedIn,
        );

        const nextItem: InstallListGame = {
          id: String(apiId),
          itemId: result.id,
          slug: game.slug,
          name: game.name,
          backgroundImage: game.coverImage || null,
          consoleSlug,
          price: game.price,
          size: game.size,
        };

        applyDraftItems(consoleSlug, [
          ...(itemsByConsole[consoleSlug] ?? []).filter((g) => g.id !== nextItem.id),
          nextItem,
        ]);
        void refreshDraft();
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "افزودن بازی ناموفق بود.";
        setToastMessage(message);
        return false;
      }

      const sourceElement = options?.sourceElement;
      if (prefersReducedMotion() || !sourceElement) {
        setToastMessage(`${game.name} به لیست بازی‌ها اضافه شد`);
        return true;
      }

      const fromRect = sourceElement.getBoundingClientRect();
      const isFirstAnimatedAdd = !hasAutoScrolledForAddRef.current;
      const needsScroll = isFirstAnimatedAdd && !isOrderPanelInViewport();

      if (needsScroll) {
        pendingScrollYRef.current = window.scrollY;
        await scrollToListTarget();
      } else {
        pendingScrollYRef.current = null;
      }

      hasAutoScrolledForAddRef.current = true;

      const listRect = getVisibleListTargetRect();
      if (!listRect) {
        if (pendingScrollYRef.current !== null) {
          await scrollBackTo(pendingScrollYRef.current);
          pendingScrollYRef.current = null;
        }
        setToastMessage(`${game.name} به لیست بازی‌ها اضافه شد`);
        return true;
      }

      const { images } = resolveGameImages({
        slug: game.slug,
        name: game.name,
        fallback: game.coverImage,
      });

      setFlyAnimation({
        gameId: game.id,
        image: images[0] ?? game.coverImage,
        fromRect,
      });
      flyActiveRef.current = true;
      return true;
    },
    [
      isInList,
      resolveDeviceTypeId,
      isLoggedIn,
      itemsByConsole,
      applyDraftItems,
      refreshDraft,
    ],
  );

  const value = useMemo<GameInstallListContextValue>(
    () => ({
      itemsByConsole,
      draftLoading,
      toastMessage,
      flyAnimation,
      flyingGameId: flyAnimation?.gameId ?? null,
      listBounce,
      isFlyActive: flyAnimation !== null,
      refreshDraft,
      isInList,
      addGameWithAnimation,
      removeGame,
      clearConsoleList,
      dismissToast,
      completeFlyAnimation,
    }),
    [
      itemsByConsole,
      draftLoading,
      toastMessage,
      flyAnimation,
      listBounce,
      refreshDraft,
      isInList,
      addGameWithAnimation,
      removeGame,
      clearConsoleList,
      dismissToast,
      completeFlyAnimation,
    ],
  );

  return (
    <GameInstallListContext.Provider value={value}>
      {children}
      <FlyToListAnimator />
      <ShopToast message={toastMessage} onDismiss={dismissToast} />
    </GameInstallListContext.Provider>
  );
}

export function useGameInstallList() {
  const context = useContext(GameInstallListContext);
  if (!context) {
    throw new Error(
      "useGameInstallList must be used within GameInstallListProvider",
    );
  }
  return context;
}
