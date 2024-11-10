import { useEffect, useState } from "preact/hooks";
import { useCamera } from "../components/CameraContext";

interface ScannerViewProps {
  // Removi a função 'showResultsView' pois não é necessária para este caso
}

export default function ScannerView(props: ScannerViewProps) {
  const camera = useCamera();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  const handleCapturePhoto = async () => {
    console.log("Tirando foto...");
    const imageData = await camera.takePicture();
    setCapturedImage(imageData);
    console.log("Foto capturada:", imageData);
  };

  const handleStartRecording = async () => {
    console.log("Iniciando gravação de vídeo...");
    setIsRecording(true);
    await camera.startVideoRecording();  // Inicia a gravação
  };

  const handleStopRecording = async () => {
    console.log("Parando gravação de vídeo...");
    setIsRecording(false);
    const videoUrl = await camera.stopVideoRecording();  // Para a gravação e retorna o URL do vídeo
    setVideoUrl(videoUrl);  // Exibe o vídeo gravado
  };

  return (
    <section class="relative h-full w-full">
      <header class="absolute left-0 top-0 flex w-full bg-white-0 p-8">
        <h1 class="text-4xl">Scannerf</h1>
      </header>
      <div class="absolute left-1/2 top-1/2 aspect-square w-2/5 -translate-x-1/2 -translate-y-1/2 border-8 border-dashed border-white-100 bg-white-900 opacity-50"></div>
      <p>O aplicativo precisa de permissões de câmera para funcionar corretamente.</p>
      <div class="flex flex-col items-stretch gap-2">
        <button
          class="rounded-md border-2 border-white-800 bg-white-100 px-4 py-2 font-bold shadow-pixel-sm active:translate-x-[2px] active:translate-y-[2px] active:bg-white-200 active:shadow-none"
          onClick={handleCapturePhoto}
        >
          Tirar Foto
        </button>
        <button
          class="mt-2 rounded-md border-2 border-white-800 bg-white-100 px-4 py-2 font-bold shadow-pixel-sm active:translate-x-[2px] active:translate-y-[2px] active:bg-white-200 active:shadow-none"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? "Parar Gravação" : "Gravar Vídeo"}
        </button>
        {capturedImage && (
          <div class="mt-4">
            <h2>Imagem Capturada:</h2>
            <img src={`data:image/jpeg;base64,${capturedImage}`} alt="Captured" class="w-full h-auto" />
          </div>
        )}
        {videoUrl && (
          <div class="mt-4">
            <h2>Vídeo Gravado:</h2>
            <video controls src={videoUrl} class="w-full h-auto"></video>
          </div>
        )}
      </div>
    </section>
  );
}
