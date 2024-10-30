import { CameraPreview } from "@capacitor-community/camera-preview";
import { ComponentChildren, createContext } from "preact";
import { useContext, useErrorBoundary, useState } from "preact/hooks";

interface CameraContext {
  isActive: boolean;
  start: () => Promise<boolean>;
  stop: () => Promise<boolean>;
  takePicture: () => Promise<unknown>;
}

const cameraContext = createContext<CameraContext | null>(null);

export function CameraProvider(props: { children?: ComponentChildren }) {
  const [isActive, setActive] = useState(false);

  const contextValue: CameraContext = {
    isActive,
    start: async () => {
      if (isActive) {
        return true;
      }

      try {
        console.log("Iniciando câmera...");
        await CameraPreview.start({
          enableOpacity: true,
          toBack: true,
        });

        setActive(true);
        return true;
      } catch (error) {
        console.error("Falha ao iniciar a câmera", error);
        return false;
      }
    },
    stop: async () => {
      if (!isActive) {
        return true;
      }

      try {
        console.log("Parando câmera...");
        await CameraPreview.stop();
        setActive(false);
        return true;
      } catch (error) {
        console.error("Falha ao parar a câmera", error);
        return false;
      }
    },
    takePicture: async () => {},
  };

  return <cameraContext.Provider value={contextValue}>{props.children}</cameraContext.Provider>;
}

export function useCamera() {
  const ctx = useContext(cameraContext);

  if (!ctx) {
    throw new Error("useCamera must be used within a <CameraProvider />");
  }

  return ctx;
}
