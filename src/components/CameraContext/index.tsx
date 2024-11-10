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
  startVideoRecording: () => Promise<void>;
  stopVideoRecording: () => Promise<string | null>;
}

const cameraContext = createContext<CameraContext | null>(null);

export function CameraProvider(props: { children?: ComponentChildren }) {
  const [permissionStatus, setPermissionStatus] = useState<PermissionCheckResult>("Unknown");
  const [isActive, setActive] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

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

        // Obtém o fluxo de mídia da câmera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);

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

        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
        }

        setCameraStream(null);
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
    startVideoRecording: async () => {
      if (!cameraStream) {
        console.error("Câmera não está ativa");
        return;
      }

      const recorder = new MediaRecorder(cameraStream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoUrl(videoUrl);
      };

      recorder.start();
      setMediaRecorder(recorder);
    },
    stopVideoRecording: async () => {
      mediaRecorder?.stop();
      setMediaRecorder(null);
      return videoUrl;
    }
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
