import { useCompass } from "../components/CompassNavigator";
import ScreenB from "./ScreenB";

export default function ScreenA() {
  const compass = useCompass();

  return (
    <section>
      <h1>Screen A</h1>
      <button onClick={() => compass.push(ScreenB, {})}>Stack Me</button>
    </section>
  );
}
