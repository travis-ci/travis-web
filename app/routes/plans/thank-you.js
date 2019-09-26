import BasicRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default BasicRoute.extend({
  metrics: service(),

  activate() {
    const page = '/plans/thank-you';
    this.metrics.trackPage({ page });
  },
});
