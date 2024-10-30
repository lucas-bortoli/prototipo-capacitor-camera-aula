type SwitchObject<T extends string | number | symbol, U> = {
  [key in T]: U;
};

export default function doSwitch<U, T extends string | number | symbol>(
  value: T,
  obj: SwitchObject<T, U>
): U {
  return obj[value];
}

type SwitchObjectWithDefault<T extends string | number | symbol, U> = {
  [key in T]?: U;
} & {
  default: U;
};

export function doSwitchWithDefault<U, T extends string | number | symbol>(
  value: T,
  obj: SwitchObjectWithDefault<T, U>
): U {
  return value in obj ? obj[value]! : obj.default;
}
