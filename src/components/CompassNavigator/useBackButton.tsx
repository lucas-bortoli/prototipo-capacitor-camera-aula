import { useEffect, useRef } from "preact/hooks";
import { App, type BackButtonListenerEvent } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";

export default function useBackButton(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    function handleBackButton(_event: BackButtonListenerEvent) {
      callbackRef.current();
    }

    let subscription: PluginListenerHandle | null = null;

    App.addListener("backButton", handleBackButton).then((handle) => {
      // cleanup previous subscription, if any
      subscription?.remove();
      subscription = handle;
    });

    return () => {
      subscription?.remove();
    };
  }, []);
}
