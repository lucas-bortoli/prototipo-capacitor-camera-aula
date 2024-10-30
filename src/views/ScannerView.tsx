import { useEffect } from "preact/hooks";
import { useCamera } from "../components/CameraContext";
import delay from "../utils/delay";
import { BrowserQRCodeReader } from "@zxing/browser";

interface ScannerViewProps {
  showResultsView: (content: string) => void;
}

export default function ScannerView(props: ScannerViewProps) {
  const camera = useCamera();

  useEffect(() => {
    camera.start();

    let breakOut = false;
    async function qrCodeLoop() {
      const reader = new BrowserQRCodeReader();

      while (breakOut === false) {
        await delay(500);

        console.log("Tirando foto...");
        const imageData = await camera.takePicture();

        try {
          console.log("Escaneando...");
          const result = await reader.decodeFromImageUrl("data:image/jpeg;base64," + imageData);
          console.log("Dados encontrados:", result);
          camera.stop();
          props.showResultsView(result.getText());
          break;
        } catch (error) {
          // QR Code não encontrado
          console.error("QR Code não encontrado", error);
        }

        await delay(500);
      }
    }

    qrCodeLoop();

    return () => {
      camera.stop();
      breakOut = true;
    };
  }, []);

  return (
    <section class="relative h-full w-full">
      <header class="absolute left-0 top-0 flex w-full bg-white-0 p-8">
        <h1 class="text-4xl">Scanner</h1>
      </header>
      <div class="absolute left-1/2 top-1/2 aspect-square w-3/5 -translate-x-1/2 -translate-y-1/2 border-8 border-dashed border-white-100 bg-white-900 opacity-50"></div>
      <p>O aplicativo precisa de permissões de câmera para funcionar corretamente.</p>
      <div class="flex flex-col items-stretch gap-2">
        <button class="shadow-pixel-sm rounded-md border-2 border-white-800 bg-white-100 px-4 py-2 font-bold active:translate-x-[2px] active:translate-y-[2px] active:bg-white-200 active:shadow-none">
          Conceder permissões
        </button>
      </div>
    </section>
  );
}
