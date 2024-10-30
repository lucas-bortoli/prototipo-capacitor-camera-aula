import { render } from "preact";
import "./index.css";
import ScreenA from "./views/ScreenA.tsx";
import { CompassProvider } from "./components/CompassNavigator";
import { CameraProvider } from "./components/CameraContext/index.tsx";

function AppRoot() {
  return (
    <CameraProvider>
      <CompassProvider>
        <ScreenA />
      </CompassProvider>
    </CameraProvider>
  );
}

render(<AppRoot />, document.getElementById("app")!);
