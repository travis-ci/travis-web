import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import config from 'travis/config/environment';
import { later } from '@ember/runloop';

const { utmParametersResetDelay } = config.timing;

export default Controller.extend({
  features: service(),
  metrics: service(),
  router: service(),
  utm: service(),

  trackPage(page) {
    page = page || this.router.currentURL || this.router.location.getURL();

    const delimiter = page.includes('?') ? '&' : '?';
    page = `${page}${delimiter}${this.utm.existing}`;

    return new Promise(resolve => {
      try {
        this.metrics.trackPage({
          page,
          hitCallback: () => resolve()
        });
        // If page is not reported to GA for some reason,
        // just resolve after a timeout to unblock teardown
        later(() => resolve(), utmParametersResetDelay);
      } catch (err) {
        resolve(); // skip error and continue
      }
    });
  },

  handleRouteChange() {
    this.trackPage().then(() => this.utm.removeFromUrl());
  },

  init() {
    this._super(...arguments);
    this.router.on('routeDidChange', () => this.handleRouteChange());
    this.utm.capture();
  }
});
