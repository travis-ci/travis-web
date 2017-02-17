import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base';

export default Ember.Route.extend(BaseRouteMixin, {
  needsAuth: false,

  redirect() {
    if (!this.get('features.proVersion')) {
      return this.transitionTo('/');
    }
  }
});
