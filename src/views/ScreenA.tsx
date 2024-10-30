import { useCompass } from "../components/CompassNavigator";
import ScreenB from "./ScreenB";

export default function ScreenA() {
  const compass = useCompass();

  return (
    <section class="h-full w-full bg-white-0 p-8">
      <h1 class="text-4xl">Bem-vindo</h1>
      <p>O aplicativo precisa de permissões de câmera para funcionar corretamente.</p>
      <button class="shadow-pixel-sm rounded-md border-2 border-white-800 bg-white-100 px-4 py-2 font-bold active:translate-x-[2px] active:translate-y-[2px] active:bg-white-200 active:shadow-none">
        Conceder permissões
      </button>
      <button onClick={() => compass.push(ScreenB, {})}>Stack Me</button>
    </section>
  );
}
