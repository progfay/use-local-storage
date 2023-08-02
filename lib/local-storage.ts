import { NoWindowError } from "./errors";
import {
  ChangeLocalStorageItemEvent,
  dispatchChangeLocalStorageItemEvent,
} from "./events";
import {
  ChangeLocalStorageItemEventListener,
  LocalStorageKey,
  LocalStorageValue,
  StorageEventListener,
} from "./types";

export const getLocalStorageItem = (
  key: LocalStorageKey
): LocalStorageValue => {
  if (typeof window === "undefined") throw new NoWindowError();
  return window.localStorage.getItem(key);
};

export const setLocalStorageItem = (
  key: LocalStorageKey,
  value: NonNullable<LocalStorageValue>
) => {
  if (typeof window === "undefined") throw new NoWindowError();
  window.localStorage.setItem(key, value);

  dispatchChangeLocalStorageItemEvent(
    new ChangeLocalStorageItemEvent(key, value)
  );
};

export const clearLocalStorageItem = (key: LocalStorageKey) => {
  if (typeof window === "undefined") throw new NoWindowError();
  window.localStorage.removeItem(key);

  dispatchChangeLocalStorageItemEvent(
    new ChangeLocalStorageItemEvent(key, null)
  );
};

const generateStorageEventListener =
  (key: LocalStorageKey): StorageEventListener =>
  (ev) => {
    if (typeof window === "undefined") throw new NoWindowError();
    if (ev.storageArea !== window.localStorage) return;
    if (ev.key !== key) return;

    dispatchChangeLocalStorageItemEvent(
      new ChangeLocalStorageItemEvent(ev.key, ev.newValue)
    );
  };

const STORAGE_EVENT_LISTENER_MAP = new Map<
  ChangeLocalStorageItemEventListener,
  StorageEventListener
>();
export const addStorageEventListener = (
  key: LocalStorageKey,
  listener: ChangeLocalStorageItemEventListener
) => {
  if (typeof window === "undefined") throw new NoWindowError();
  const emitChange = generateStorageEventListener(key);
  STORAGE_EVENT_LISTENER_MAP.set(listener, emitChange);

  window.addEventListener("storage", emitChange);
};

export const removeStorageEventListener = (
  listener: ChangeLocalStorageItemEventListener
) => {
  if (typeof window === "undefined") throw new NoWindowError();

  const emitChange = STORAGE_EVENT_LISTENER_MAP.get(listener);
  if (emitChange === undefined) return;

  window.removeEventListener("storage", emitChange);
  STORAGE_EVENT_LISTENER_MAP.delete(listener);
};
