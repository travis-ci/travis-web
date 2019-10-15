import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import { computed } from '@ember/object';

export default Controller.extend({
  auth: service(),
  router: service(),

  endpoint: config.authEndpoint || config.apiEndpoint,

  isRedirectingToAccountPage: computed('model.redirectUri', function () {
    const redirectTo = new URL(this.model.redirectUri);
    const { host, protocol, href: fullRedirectUrl } = redirectTo;
    const accountUrl = this.router.urlFor('account.billing');
    return `${protocol}//${host}${accountUrl}` === fullRedirectUrl;
  }),
});
