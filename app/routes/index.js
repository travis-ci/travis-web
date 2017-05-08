import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Route.extend({
  auth: service(),

  renderTemplate(...args) {
    if (this.get('auth.signedIn')) {
      Ember.$('body').attr('id', 'home');

      this._super(args);

      return this.render('repos', {
        outlet: 'left',
        into: 'index'
      });
    } else {
      return this._super(args);
    }
  }
});
