/* global TravisTracer, window */

import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (TravisTracer.isEnabled()) {
      TravisTracer.disable()
    } else {
      TravisTracer.enable()
    }
    window.location = '/';
  }
});
