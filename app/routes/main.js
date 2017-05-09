import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  renderTemplate(...args) {
    if (this.get('auth.signedIn')) {
      Ember.$('body').attr('id', 'home');

      this._super(args);

      this.render('repos', {
        outlet: 'left',
        into: 'main'
      });
    } else {
      return this._super(args);
    }
  },
});
