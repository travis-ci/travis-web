export default function abstractMethod(name) {
  const nameSuffix = name ? `for ${name}` : '';
  return function () {
    throw new Error(`Must supply an implementation ${nameSuffix}`);
  };
}
