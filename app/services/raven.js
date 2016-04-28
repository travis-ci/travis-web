import RavenLogger from 'ember-cli-sentry/services/raven';

export default RavenLogger.extend({
  // whitelist benign "errors"
  whitelistMessages: [
    'TransitionAborted',
    'UnrecognizedURLError',
    'not found',
    'returned a 403',
    'returned a 404',
    'Adapter operation failed',
  ],

  unhandledPromiseErrorMessage: '',

  captureException(/* error */) {
    this._super(...arguments);
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
      return this.get('whitelistMessages').any((whitelistedMessage) => {
        return message.includes(whitelistedMessage);
      });
    }
  },

  callRaven(/* methodName, ...optional */) {
    return this._super(...arguments);
  },

  shouldReportError() {
    // Sentry recommends only reporting a small subset of the actual
    // frontend errors. This can get *very* noisy otherwise.
    var sampleRate = 10;
    return (Math.random() * 100 <= sampleRate);
  }
});
