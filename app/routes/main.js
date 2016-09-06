import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({

  redirect() {
    if (this.features.get('dashboard')) {
      return this.transitionTo('dashboard');
    }
  },

  renderTemplate() {
    Ember.$('body').attr('id', 'home');

    this._super(...arguments);

    return this.render('repos', {
      outlet: 'left',
      into: 'main'
    });
  }
});
