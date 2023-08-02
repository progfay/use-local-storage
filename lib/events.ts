import {
  addStorageEventListener,
  removeStorageEventListener,
} from "./local-storage";
import type {
  ChangeLocalStorageItemEventListener,
  LocalStorageKey,
  LocalStorageValue,
} from "./types";

export const CHANGE_LOCAL_STORAGE_ITEM_EVENT_TYPE =
  "changeLocalStorageItemEventType";

export class ChangeLocalStorageItemEvent extends Event {
  key: LocalStorageKey;
  value: LocalStorageValue;

  constructor(key: LocalStorageKey, value: LocalStorageValue) {
    super(CHANGE_LOCAL_STORAGE_ITEM_EVENT_TYPE);
    this.key = key;
    this.value = value;
  }
}

const ChangeLocalStorageItemEventTarget = new EventTarget();

export const dispatchChangeLocalStorageItemEvent = (
  ev: ChangeLocalStorageItemEvent
) => {
  ChangeLocalStorageItemEventTarget.dispatchEvent(ev);
};

const generateEventListener =
  (
    key: LocalStorageKey,
    changeLocalStorageItemEventListener: ChangeLocalStorageItemEventListener
  ): EventListener =>
  (ev) => {
    if (!(ev instanceof ChangeLocalStorageItemEvent)) return;
    if (ev.key !== key) return;
    changeLocalStorageItemEventListener(ev);
  };

const CHANGE_LOCAL_STORAGE_ITEM_EVENT_LISTENER_MAP = new Map<
  ChangeLocalStorageItemEventListener,
  EventListener
>();

export const addChangeLocalStorageItemEventListener = (
  key: LocalStorageKey,
  listener: ChangeLocalStorageItemEventListener
) => {
  addStorageEventListener(key, listener);

  const eventListener = generateEventListener(key, listener);
  CHANGE_LOCAL_STORAGE_ITEM_EVENT_LISTENER_MAP.set(listener, eventListener);
  ChangeLocalStorageItemEventTarget.addEventListener(
    CHANGE_LOCAL_STORAGE_ITEM_EVENT_TYPE,
    eventListener
  );
};

export const removeChangeLocalStorageItemEventListener = (
  listener: ChangeLocalStorageItemEventListener
) => {
  removeStorageEventListener(listener);

  const eventListener =
    CHANGE_LOCAL_STORAGE_ITEM_EVENT_LISTENER_MAP.get(listener);
  if (eventListener === undefined) return;

  CHANGE_LOCAL_STORAGE_ITEM_EVENT_LISTENER_MAP.delete(listener);
  ChangeLocalStorageItemEventTarget.removeEventListener(
    CHANGE_LOCAL_STORAGE_ITEM_EVENT_TYPE,
    eventListener
  );
};
