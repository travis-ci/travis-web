import RavenLogger from 'ember-cli-sentry/services/raven';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default RavenLogger.extend({
  features: service(),

  benignErrors: [
    'TransitionAborted',
    'TaskInstance',
    'UnrecognizedURLError',
    'not found',
    'returned a 403',
    'returned a 404',
    'operation failed',
    'operation was aborted',
    'needs-auth'
  ],

  unhandledPromiseErrorMessage: '',

  captureException(/* error */) {
    this._super(...arguments);
  },

  logException(e, forceSampling = false) {
    // eslint-disable-next-line
    console.log('Caught an exception:', e);

    if (!this.ignoreError(e, forceSampling)) {
      this.captureException(e);
    }
  },

  captureMessage(/* message */) {
    return this._super(...arguments);
  },

  enableGlobalErrorCatching() {
    return this._super(...arguments);
  },

  ignoreError(error, forceSampling = false) {
    if (!this.shouldReportError(forceSampling)) {
      return true;
    } else {
      const message = error.message;
      if (message) {
        return this.benignErrors.some(error => message.includes(error));
      } else {
        return false;
      }
    }
  },

  callRaven(/* methodName, ...optional */) {
    return this._super(...arguments);
  },

  shouldReportError(forceSampling) {
    // Sentry recommends only reporting a small subset of the actual
    // frontend errors. This can get *very* noisy otherwise.
    console.log("enterpriseVersion", this.get('features.enterpriseVersion'));
    if (this.get('features.enterpriseVersion') || config.sentry.development) {
      return false;
    } else if (forceSampling) {
      return true;
    } else {
      return this.sampleError();
    }
  },

  sampleError() {
    let sampleRate = 10;
    return (Math.random() * 100 <= sampleRate);
  }
});
