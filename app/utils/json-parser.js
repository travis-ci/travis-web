export default function parseWithDefault(json, defaultValue) {
  try {
    return JSON.parse(json) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
