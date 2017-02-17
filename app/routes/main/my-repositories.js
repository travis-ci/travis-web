import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {
  redirect() {
    return this.transitionTo('main.repositories');
  }
});
