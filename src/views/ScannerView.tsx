import { useEffect, useState } from "preact/hooks";
import { useCamera } from "../components/CameraContext";
import { BrowserQRCodeReader } from "@zxing/browser";

interface ScannerViewProps {
  showResultsView: (content: string) => void;
}

export default function ScannerView(props: ScannerViewProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const camera = useCamera();

  useEffect(() => {
    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  const handleTakePhoto = async () => {
    const reader = new BrowserQRCodeReader();

    console.log("Capturando foto...");
    const imageData = await camera.takePicture();
    setPhoto(imageData); // Store the captured photo

    try {
      console.log("Escaneando...");
      const result = await reader.decodeFromImageUrl("data:image/jpeg;base64," + imageData);
      console.log("Dados encontrados:", result);
      props.showResultsView(result.getText());
    } catch (error) {
      console.error("QR Code não encontrado", error);
    }
  };

  return (
    <section class="relative h-full w-full">
      <header class="absolute left-0 top-0 flex w-full bg-white-0 p-8 z-10">
        <h1 class="text-4xl">Scanner</h1>
        <button
          onClick={handleTakePhoto}
          class="rounded-md border-2 border-white-800 bg-white-100 px-4 py-2 font-bold shadow-pixel-sm active:translate-x-[2px] active:translate-y-[2px] active:bg-white-200 active:shadow-none"
        >
          Tirar Foto
        </button>
      </header>

      <div class="absolute left-1/2 top-1/2 aspect-square w-2/5 -translate-x-1/2 -translate-y-1/2 border-8 border-dashed border-white-100 bg-white-900 opacity-50 z-0"></div>

      <div class="flex flex-col items-center gap-4 mt-20 z-10">
        {photo && (
          <div class="photo-preview">
            <img src={`data:image/jpeg;base64,${photo}`} alt="Captured" />
          </div>
        )}
        
      </div>
      
    </section>
  );
}
