export type Sequence = number & { _tag?: "sequence" };

export default function sequence(start: number = 0) {
  let value = start;

  return function next(): Sequence {
    value++;
    return value;
  };
}
