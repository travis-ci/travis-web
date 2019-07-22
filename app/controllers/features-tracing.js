/* global TravisTracer */

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
    }
  }
});
