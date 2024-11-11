import { useEffect } from "preact/hooks";
import { useCamera } from "../components/CameraContext";
import doSwitch from "../utils/switch_expression";

interface WelcomeViewProps {
  goToScanner: () => void;
}

export default function WelcomeView(props: WelcomeViewProps) {
  const camera = useCamera();

  async function onRequestPermissionsButton() {
    if (camera.permissionStatus === "NeedsRequest") {
      await camera.requestPermissions();
    }
  }


  useEffect(() => {
    if (camera.permissionStatus === "Allowed") {
      props.goToScanner();
    }
  }, [camera.permissionStatus]);

  if (camera.permissionStatus === "Unknown") {
    return <div />;
  }

  return (
    <section class="flex h-full w-full flex-col gap-2 bg-white-0 p-8">
      <h1 class="text-4xl">Bem-vindo</h1>
      <p>O aplicativo precisa de permissões de câmera para funcionar corretamente.</p>
      <p>
        Permissão da câmera:{" "}
        <span class="font-bold">
          {doSwitch(camera.permissionStatus, {
            Allowed: "OK",
            Denied: "Negada",
            NeedsRequest: "Precisa ser confirmada ainda",
          })}
        </span>
      </p>
      {camera.permissionStatus === "Denied" && (
        <p class="text-error-on-light font-bold">
          A permissão de câmera foi negada. É preciso conceder a permissão através das configurações
          do aplicativo no sistema.
        </p>
      )}
      <div class="flex flex-col items-stretch gap-2">
        <button
          class="shadow-pixel-sm rounded-md border-2 border-white-800 bg-white-100 px-4 py-2 font-bold active:translate-x-[2px] active:translate-y-[2px] active:bg-white-200 active:shadow-none"
          onClick={onRequestPermissionsButton}>
          Conceder permissões
        </button>
      </div>
    </section>
  );
}