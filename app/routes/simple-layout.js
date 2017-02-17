import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {
  setupController: function () {
    Ember.$('body').attr('id', 'simple');
    this.controllerFor('repos').activate('owned');
    return this._super(...arguments);
  }
});
