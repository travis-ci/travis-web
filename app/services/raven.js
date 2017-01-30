import RavenLogger from 'ember-cli-sentry/services/raven';
import config from 'travis/config/environment';

export default RavenLogger.extend({
  benignErrors: [
    'TransitionAborted',
    'UnrecognizedURLError',
    'not found',
    'returned a 403',
    'returned a 404',
    'Adapter operation failed'
  ],

  unhandledPromiseErrorMessage: '',

  captureException(/* error */) {
    this._super(...arguments);
  },

  logException(e) {
    // eslint-disable-next-line
    console.log('Caught an exception:', e);

    if (!this.ignoreError(e)) {
      this.captureException(e);
    }
  },

  captureMessage(/* message */) {
    return this._super(...arguments);
  },

  enableGlobalErrorCatching() {
    return this._super(...arguments);
  },

  ignoreError(error) {
    if (!this.shouldReportError()) {
      return true;
    } else {
      let { message } = error;
      return this.get('benignErrors').any(error => message.includes(error));
    }
  },

  callRaven(/* methodName, ...optional */) {
    return this._super(...arguments);
  },

  shouldReportError() {
    // Sentry recommends only reporting a small subset of the actual
    // frontend errors. This can get *very* noisy otherwise.
    if (config.enterprise || config.sentry.development) {
      return false;
    } else {
      let sampleRate = 10;
      return (Math.random() * 100 <= sampleRate);
    }
  }
});
