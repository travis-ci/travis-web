import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  routeModel: computed('owner', function () {
    return this.owner.isOrganization ? this.owner : null;
  }),

  webhooksRouteName: computed('owner', function () {
    return `${this.owner.isOrganization ? 'organization' : 'account'}.migrate.webhooks`;
  }),

  appsRouteName: computed('owner', function () {
    return `${this.owner.isOrganization ? 'organization' : 'account'}.migrate.github-apps`;
  })

});
