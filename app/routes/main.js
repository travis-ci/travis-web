import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import getOwner from 'ember-getowner-polyfill';

export default TravisRoute.extend({
  renderTemplate() {
    $('body').attr('id', 'home');

    this._super.apply(this, arguments);

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
