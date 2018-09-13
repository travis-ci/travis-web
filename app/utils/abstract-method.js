export default function abstractMethod(name) {
  const nameSufix = name ? `for ${name}` : '';
  return function () {
    throw new Error(`Must supply an implementation ${nameSufix}`);
  };
}
