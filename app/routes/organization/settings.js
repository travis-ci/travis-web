import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default TravisRoute.extend({

  model() {
    const organization = this.modelFor('organization');
    return hash({ organization });
  },

  // setupController(controller, model) {
  //   this._super(...arguments);
  //   controller.fetchRepositories.perform();
  // }
});
