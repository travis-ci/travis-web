import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  renderTemplate() {
    // $('body').attr('id', 'home');

    this._super.apply(this, arguments);

    // return this.render('repos', {
    //   outlet: 'left',
    //   into: 'main'
    // });
  },

  layoutClass: "main",

  setupController(model, controller) {
    if (!this.get('auth.signedIn')) {
      if (this.features.isEnabled('enterprise')) {
      } else {
        this.controller.set('layoutName', 'layouts/landing-page');
        if (this.features.isEnabled('pro')) {
          this.controller.set('layoutClass', 'landing-pro');
        }
      }
    }
  },
  needsAuth: false
});
