export default function bindGenerator(genFn, context) {
  return function* boundGenerator(...args) {
    let iter = genFn.apply(context, args);
    let result = { value: undefined, done: false };
    while (!result.done) {
      result = iter.next(result.value);
      yield result.value;
    }
    return result.value;
  };
}

