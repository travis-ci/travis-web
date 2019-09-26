import BasicRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default BasicRoute.extend({
  metrics: service(),
  raven: service(),

  activate() {
    const page = '/plans/thank-you';
    try {
      this.metrics.trackPage({ page });
    } catch (err) {
      this.raven.logException('Metrics error');
    }
  },
});
