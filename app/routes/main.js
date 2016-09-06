import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  renderTemplate() {
    Ember.$('body').attr('id', 'home');

    this._super(...arguments);

    return this.render('repos', {
      outlet: 'left',
      into: 'main'
    });
  }
});
