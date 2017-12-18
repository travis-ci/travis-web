import config from 'travis/config/environment';

class Tracer {
  constructor() {
    this.requestStack = [];
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

  slowest() {
    let requestStack = this.requestStack.slice();
    requestStack = requestStack.filter(req => req.duration);
    requestStack.sort((a, b) => b.duration - a.duration);
    return requestStack.slice(0, 5);
  }

  format(requests) {
    requests.forEach(req => {
      let requestId = req.requestId;
      if (config.apiTraceEndpoint) {
        requestId = `${config.apiTraceEndpoint}${requestId}`;
      }
      // eslint-disable-next-line
      console.log(`${req.method} ${req.url} ${req.status} ${req.duration}ms\n${requestId}`);
    });
  }

  showAll() {
    this.format(this.requestStack);
  }

  showSlowest() {
    this.format(this.slowest());
  }

  // xhr interceptor based on the symfony profiler
  install() {
    let tracer = this;

    let proxied = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
      let self = this;

      if (url.startsWith(config.apiEndpoint)) {
        let stackElement = {
          loading: true,
          error: false,
          url: url.substr(config.apiEndpoint.length),
          method: method,
          start: new Date()
        };

        tracer.requestStack.push(stackElement);

        this.addEventListener('readystatechange', () => {
          if (self.readyState == 4) {
            stackElement.status = self.status;
            stackElement.duration = new Date() - stackElement.start;
            stackElement.loading = false;
            stackElement.error = self.status < 200 || self.status >= 400;
            stackElement.requestId = self.getResponseHeader('X-Request-ID');
          }
        }, false);
      }

      proxied.call(this, ...arguments);

      if (url.startsWith(config.apiEndpoint)) {
        this.setRequestHeader('Trace', 'true');
      }
    };
  }
}

export function initialize(app) {
  if (typeof window !== 'undefined') {
    window.TravisTracer = new Tracer();
    if (window.TravisTracer.isEnabled()) {
      window.TravisTracer.install();
    }
    return window.TravisTracer;
  }
}

export default {
  name: 'tracer',
  initialize,
};
