/* global TravisTracer, window */

import Controller from '@ember/controller';

export default Controller.extend({
  tracingEnabled: TravisTracer.isEnabled(),

  actions: {
    toggle() {
      if (TravisTracer.isEnabled()) {
        TravisTracer.disable();
      } else {
        TravisTracer.enable();
      }
      window.location = window.location; // eslint-disable-line
    }
  }
});
