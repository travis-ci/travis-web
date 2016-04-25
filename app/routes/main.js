import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  renderTemplate() {
    $('body').attr('id', 'home');

    this._super(...arguments);

    return this.render('repos', {
      outlet: 'left',
      into: 'main'
    });
  },

  setupController(controller) {
    // TODO: this is redundant with repositories and recent routes
    // @container.lookup('controller:repos').activate('owned')
  }
});
