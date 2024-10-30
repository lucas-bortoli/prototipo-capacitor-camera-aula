import { useCamera } from "../components/CameraContext";
import { useCompass } from "../components/CompassNavigator";

export default function ScreenA() {
  const compass = useCompass();
  const camera = useCamera();

  async function onConcedePermissionsButton() {
    if (!camera.isActive) {
      const result = await camera.start();
      console.log("Result:", result);
    } else {
      const result = await camera.stop();
      console.log("Result:", result);
    }
  }

  return (
    <section class="h-1 w-full bg-white-0 p-8">
      <h1 class="text-4xl">Bem-vindo</h1>
      <p>O aplicativo precisa de permissões de câmera para funcionar corretamente.</p>
      <p>Status: {camera.isActive ? "ativo" : "inativo"}</p>
      <button
        class="shadow-pixel-sm rounded-md border-2 border-white-800 bg-white-100 px-4 py-2 font-bold active:translate-x-[2px] active:translate-y-[2px] active:bg-white-200 active:shadow-none"
        onClick={onConcedePermissionsButton}>
        Conceder permissões
      </button>
    </section>
  );
}
