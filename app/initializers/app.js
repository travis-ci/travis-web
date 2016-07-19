let Initializer, initialize;

initialize = app => {
  if (typeof window !== 'undefined') {
    return window.Travis = app;
  }
};

Initializer = {
  name: 'app',
  initialize
};

export { initialize };

export default Initializer;
