/* global TravisTracer, window */

import Controller from '@ember/controller';
import { action } from 'ember-decorators/object';

export default Controller.extend({
  tracingEnabled: TravisTracer.isEnabled(),

  @action
  toggle() {
    if (TravisTracer.isEnabled()) {
      TravisTracer.disable();
    } else {
      TravisTracer.enable();
    }
    window.location = window.location;
  }
});
