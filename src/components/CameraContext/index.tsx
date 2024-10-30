import { CameraPreview } from "@capacitor-community/camera-preview";
import { Camera } from "@capacitor/camera";
import { ComponentChildren, createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import doSwitch from "../../utils/switch_expression";

type PermissionCheckResult = "Unknown" | "NeedsRequest" | "Denied" | "Allowed";

interface CameraContext {
  isActive: boolean;
  permissionStatus: PermissionCheckResult;
  start: () => Promise<boolean>;
  stop: () => Promise<boolean>;
  takePicture: () => Promise<string>;
  checkPermissions: () => Promise<PermissionCheckResult>;
  requestPermissions: () => Promise<PermissionCheckResult>;
}

const cameraContext = createContext<CameraContext | null>(null);

export function CameraProvider(props: { children?: ComponentChildren }) {
  const [permissionStatus, setPermissionStatus] = useState<PermissionCheckResult>("Unknown");
  const [isActive, setActive] = useState(false);

  const contextValue: CameraContext = {
    isActive,
    permissionStatus: permissionStatus,
    start: async () => {
      if (isActive) {
        return true;
      }

      try {
        console.log("Iniciando câmera...");
        await CameraPreview.start({
          enableOpacity: true,
          toBack: true,
          enableZoom: true,
          lockAndroidOrientation: true,
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
    takePicture: async () => {
      const imageData = await CameraPreview.captureSample({ quality: 60 });

      return imageData.value;
    },
    checkPermissions: async () => {
      const result = await Camera.checkPermissions();
      const status: PermissionCheckResult = doSwitch(result.camera, {
        prompt: "NeedsRequest",
        "prompt-with-rationale": "NeedsRequest",
        denied: "Denied",
        granted: "Allowed",
        limited: "Allowed",
      });
      setPermissionStatus(status);
      return status;
    },
    requestPermissions: async () => {
      const result = await Camera.requestPermissions({
        permissions: ["camera"],
      });
      const status: PermissionCheckResult = doSwitch(result.camera, {
        prompt: "NeedsRequest",
        "prompt-with-rationale": "NeedsRequest",
        denied: "Denied",
        granted: "Allowed",
        limited: "Allowed",
      });
      setPermissionStatus(status);
      return status;
    },
  };

  useEffect(() => {
    contextValue.checkPermissions().then((value) => {
      setPermissionStatus(value);
    });
  }, []);

  return <cameraContext.Provider value={contextValue}>{props.children}</cameraContext.Provider>;
}

export function useCamera() {
  const ctx = useContext(cameraContext);

  if (!ctx) {
    throw new Error("useCamera must be used within a <CameraProvider />");
  }

  return ctx;
}
