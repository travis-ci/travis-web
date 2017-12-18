export function initialize(app) {
  if (typeof window !== 'undefined') {
    return window.Travis = app;
  }
}

export default {
  name: 'app',
  initialize,
};
