/* global window, XMLHttpRequest */

import config from 'travis/config/environment';
import { isFastboot, win, doc } from 'travis/utils/fastboot';

const initialize = (function (window) {
  class Tracer {
    constructor() {
      this.requests = [];
    }

    enable() {
      window.localStorage['apiTrace'] = 'true';
    }

    disable() {
      delete window.localStorage['apiTrace'];
    }

    isEnabled() {
      return window.localStorage['apiTrace'] === 'true';
    }

    onRequest() {
    }

    install() {
      this.installXHR();
    }

    // xhr interceptor based on the symfony profiler
    installXHR() {
      let tracer = this;

      let proxied = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (method, url) {
        let self = this;

        if (url.startsWith(config.apiEndpoint)) {
          let req = {
            loading: true,
            error: false,
            url: url.substr(config.apiEndpoint.length),
            method: method,
            start: new Date()
          };

          tracer.requests.push(req);

          this.addEventListener('readystatechange', () => {
            if (self.readyState == 4) {
              req.status = self.status;
              req.duration = new Date() - req.start;
              req.loading = false;
              req.error = self.status < 200 || self.status >= 400;
              req.requestId = self.getResponseHeader('X-Request-ID');
              req.requestIdShort = req.requestId ? req.requestId.substr(0, 8) : null;

              tracer.onRequest(req);
            }
          }, false);
        }

        proxied.call(this, ...arguments);

        if (url.startsWith(config.apiEndpoint)) {
          this.setRequestHeader('Trace', 'true');
        }
      };
    }

    bookmarklet() {
      if (this.isEnabled()) {
        this.disable();
      } else {
        this.enable();
      }
    }
  }

  return function initialize() {
    if (!isFastboot) {
      window.TravisTracer = new Tracer();
      if (window.TravisTracer.isEnabled()) {
        window.TravisTracer.install();
        config.featureFlags.tracer = true;
      }
      return window.TravisTracer;
    }
  };
}(isFastboot ? win : window, isFastboot ? doc : document));

export { initialize };

export default {
  name: 'tracer',
  initialize,
};
