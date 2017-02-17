import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {
  titleToken: 'Profile',
  needsAuth: true,

  renderTemplate() {
    Ember.$('body').attr('id', 'profile');
    this._super(...arguments);

    return this.render('loading', {
      outlet: 'left',
      into: 'profile'
    });
  }
});
