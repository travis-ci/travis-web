import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

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
