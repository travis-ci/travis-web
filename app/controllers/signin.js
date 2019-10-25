import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Controller.extend({
  auth: service(),
  router: service(),
  redirectUri: reads('model.redirectUri'),

  isRedirectingToAccountPage: computed('redirectUri', function () {
    if (this.redirectUri) {
      const { pathname } = new URL(this.redirectUri);
      const accountUrl = this.router.urlFor('account.billing');
      return this.isOrganizationUrl(pathname) || accountUrl === pathname;
    }
    return false;
  }),

  isOrganizationUrl(pathname) {
    return pathname && pathname.startsWith('/organizations') && pathname.endsWith('subscription');
  }
});
