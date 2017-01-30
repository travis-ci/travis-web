import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
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
