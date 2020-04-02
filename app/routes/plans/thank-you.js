import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  metrics: service(),
  utm: service(),

  activate() {
    const page = `/plans/thank-you?${this.utm.existing.toString()}`;
    this.controllerFor('application').trackPage(page);
  }
});
