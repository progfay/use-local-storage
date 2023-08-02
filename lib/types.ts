import type { ChangeLocalStorageItemEvent } from "./events";

export type LocalStorageKey = Parameters<Storage["getItem"]>[0];
export type LocalStorageValue = ReturnType<Storage["getItem"]>;
export type StorageEventListener = (ev: StorageEvent) => void;
export type ChangeLocalStorageItemEventListener = (
  ev: ChangeLocalStorageItemEvent
) => void;
