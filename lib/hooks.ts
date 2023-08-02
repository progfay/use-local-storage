import { useCallback, useSyncExternalStore } from "react";
import { LocalStorageKey } from "./types";
import { getLocalStorageItem } from "./local-storage";
import {
  addChangeLocalStorageItemEventListener,
  removeChangeLocalStorageItemEventListener,
} from "./events";

export const useLocalStorage = (key: LocalStorageKey) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => () => {
      addChangeLocalStorageItemEventListener(key, onStoreChange);
      return removeChangeLocalStorageItemEventListener(onStoreChange);
    },
    []
  );
  const getSnapshot = useCallback(() => getLocalStorageItem(key), [key]);

  const localStorageValue = useSyncExternalStore(subscribe, getSnapshot);

  return localStorageValue;
};
