import TravisRoute from 'travis/routes/basic';
import {inject as service} from '@ember/service';

export default TravisRoute.extend({
  tabStates: service(),
  model() {
    return this.modelFor('repo');
  },
  setupController(controller, model, transition) {
    this.set('tabStates.MainTab', 'current');
    super.setupController(controller, model, transition);
    controller.set('repo', model);
  }
});
