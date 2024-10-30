import { useState } from "preact/hooks";
import { useCompass } from "../components/CompassNavigator";

export default function ScreenB() {
  const [counter, setCounter] = useState(0);
  const compass = useCompass();

  return (
    <section>
      <h1>Screen B</h1>
      <p>My counter: {counter}</p>
      <div class="flex flex-col gap-2">
        <button onClick={() => setCounter((c) => c + 1)}>Increase</button>
        <button onClick={() => compass.push(ScreenB, {})}>Push new one</button>
        <button onClick={() => compass.pop()}>Pop me</button>
      </div>
    </section>
  );
}
