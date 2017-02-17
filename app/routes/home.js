import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {

  model() {
    return { landingPage: true };
  },

  setupController(controller/* , model*/) {
    return controller.set('repos', this.get('repos'));
  }
});
