var Initializer, initialize;

initialize = function(app) {
  if (typeof window !== 'undefined') {
    return window.Travis = app;
  }
};

Initializer = {
  name: 'app',
  initialize: initialize
};

export {initialize};

export default Initializer;
