/*
 * This utility helps to bind a generator function in a similar way that `Function.prototype.bind` does.
 *
 * Example:
 *
 * const gen = function* (param1, param2) {
 *  yield something();
 * }
 *
 * const boundGenerator = bindGenerator(gen, this); // the `boundGenerator` is the generator function bound to `this` context
 */
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

