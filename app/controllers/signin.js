import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Controller.extend({
  auth: service('auth'),
  router: service('router'),
  redirectUri: reads('model.redirectUri'),
  endpoint: config.authEndpoint || config.apiEndpoint,

  isRedirectingToAccountPage: computed('redirectUri', function () {
    if (this.redirectUri) {
      const redirectTo = new URL(this.redirectUri);
      const { pathname } = redirectTo;
      const accountUrl = this.router.urlFor('account.billing');
      return this.isOrganizationUrl(pathname) || accountUrl === pathname;
    }
    return false;
  }),

  isOrganizationUrl(pathname) {
    if (pathname) {
      return pathname.startsWith('/organizations') && pathname.endsWith('subscription');
    }
    return false;
  }
});
