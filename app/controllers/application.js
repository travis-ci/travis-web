import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import QueryParams from 'ember-parachute';
import { Promise } from 'rsvp';
import config from 'travis/config/environment';
import { UTM_FIELDS, UTM_FIELD_NAMES } from 'travis/services/utm';
import { later } from '@ember/runloop';

const { utmParametersResetDelay } = config.timing;

export const UTM_QUERY_PARAMS = new QueryParams({
  [UTM_FIELDS.CAMPAIGN]: { defaultValue: null, replace: true, refresh: true },
  [UTM_FIELDS.CONTENT]: { defaultValue: null, replace: true, refresh: true },
  [UTM_FIELDS.MEDIUM]: { defaultValue: null, replace: true, refresh: true },
  [UTM_FIELDS.SOURCE]: { defaultValue: null, replace: true, refresh: true },
  [UTM_FIELDS.TERM]: { defaultValue: null, replace: true, refresh: true },
});

export default Controller.extend(UTM_QUERY_PARAMS.Mixin, {
  features: service(),
  utm: service(),
  router: service(),
  metrics: service(),

  setup({ queryParams }) {
    this.utm.capture(queryParams);
  },

  reportPage() {
    return new Promise(resolve => {
      try {
        this.metrics.trackPage({
          page: this.router.currentURL,
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
    this.reportPage().then(() => {
      if (this.utm.hasData) {
        this.resetUTMs();
      }
    });
  },

  resetUTMs() {
    try {
      this.resetQueryParams([...UTM_FIELD_NAMES]);
    } catch (e) {}
  },

  init() {
    this._super(...arguments);
    this.router.on('routeDidChange', () => this.handleRouteChange());
  }
});
