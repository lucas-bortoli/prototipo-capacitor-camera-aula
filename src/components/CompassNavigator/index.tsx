import type { JSX } from "preact/jsx-runtime";
import sequence, { Sequence } from "../../Sequence";
import { useContext, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";
import style from "./style.module.css";
import { cn } from "../../utils/cn";
import doSwitch from "../../utils/switch_expression";

type RouteKey = Sequence;
const makeRouteKey = sequence();

interface Route<P> {
  key: RouteKey;
  props: P;
  state: "entering" | "normal" | "leaving";
  component: (props: P) => JSX.Element;
}

interface CompassContext {
  routeStack: Route<any>[];
  push<P>(component: (props: P) => JSX.Element, props: P): void;
  pop(): void;
}

const CompassCtx = createContext<CompassContext | null>(null);

export function CompassProvider(props: { children: ComponentChildren }) {
  const [routeStack, setRouteStack] = useState<Route<any>[]>([]);

  function setRouteState(routeKey: RouteKey, state: Route<any>["state"]) {
    setRouteStack((stack) => stack.map((r) => (r.key === routeKey ? { ...r, state } : r)));
  }

  const compass: CompassContext = {
    routeStack,
    push: (component, props) => {
      const route = {
        key: makeRouteKey(),
        component,
        props,
        state: "entering",
      } satisfies Route<any>;

      setRouteStack((routeStack) => [...routeStack, route]);
    },
    pop: () => {
      const targetRoute = routeStack.at(-1);
      if (!targetRoute) {
        console.warn("Tried to pop off a route, but there are no routes on the stack.");
        return;
      }

      setRouteState(targetRoute.key, "leaving");
    },
  };

  function handleAnimationEndOnRoute(
    routeKey: Sequence,
    event: JSX.TargetedAnimationEvent<HTMLElement>
  ) {
    console.log("Animation End", routeKey, event.animationName);
    switch (event.animationName) {
      case style.AnimationRouteEnter:
        setRouteState(routeKey, "normal");
        break;
      case style.AnimationRouteLeave:
        setRouteStack((routeStack) => routeStack.filter((r) => r.key !== routeKey));
        break;
    }
  }

  return (
    <CompassCtx.Provider value={compass}>
      {props.children}
      {routeStack.map((route) => {
        const animationClass = doSwitch(route.state, {
          normal: style.routeWhenNormal,
          entering: style.routeWhenEntering,
          leaving: style.routeWhenLeaving,
        });

        return (
          <section
            key={route.key}
            onAnimationEnd={handleAnimationEndOnRoute.bind(null, route.key)}
            class={cn("fixed left-0 top-0 h-full w-full bg-white", style.route, animationClass)}>
            <route.component {...route.props} />
          </section>
        );
      })}
    </CompassCtx.Provider>
  );
}

export function useCompass() {
  const ctx = useContext(CompassCtx);

  if (!ctx) {
    throw new Error("useCompass must be used within a <Compass />");
  }

  return ctx!;
}
