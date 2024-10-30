import { render } from "preact";
import "./index.css";
import RootScreen from "./views/WelcomeView.tsx";
import { CompassProvider } from "./components/CompassNavigator";
import { CameraProvider } from "./components/CameraContext/index.tsx";
import { useState } from "preact/hooks";
import WelcomeView from "./views/WelcomeView.tsx";
import ScanResultsView from "./views/ScanResultsView.tsx";
import ScannerView from "./views/ScannerView.tsx";

type View = "Welcome" | "Scanner" | "ScanResults";

function AppRoot() {
  const [view, setView] = useState<View>("Welcome");
  const [scanContent, setScanContent] = useState<string | null>(null);

  return (
    <CameraProvider>
      {view === "Welcome" && <WelcomeView goToScanner={() => setView("Scanner")} />}
      {view === "Scanner" && (
        <ScannerView
          showResultsView={(content) => {
            setScanContent(content);
            setView("ScanResults");
          }}
        />
      )}
      {view === "ScanResults" && scanContent !== null && (
        <ScanResultsView scanContent={scanContent} goBackToScanner={() => setView("Scanner")} />
      )}
    </CameraProvider>
  );
}

render(<AppRoot />, document.getElementById("app")!);
