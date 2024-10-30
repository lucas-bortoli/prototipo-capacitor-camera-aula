import { render } from "preact";
import "./index.css";
import ScreenA from "./views/ScreenA.tsx";
import { CompassProvider } from "./components/CompassNavigator";

function AppRoot() {
  return (
    <CompassProvider>
      <ScreenA />
    </CompassProvider>
  );
}

render(<AppRoot />, document.getElementById("app")!);
