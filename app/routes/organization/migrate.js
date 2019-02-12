import Route from '@ember/routing/route';
import OwnerMigrateRouteMixin from 'travis/mixins/route/owner/migrate';

export default Route.extend(OwnerMigrateRouteMixin, {

  beforeModel() {
    this.account = this.modelFor('organization');
  },

  redirect({ orgRepos, webhookRepos, owner }) {
    if (webhookRepos.length > 0) {
      return this.transitionTo('organization.migrate.webhooks', owner);
    } else if (orgRepos.length > 0) {
      return this.transitionTo('organization.migrate.github-apps', owner);
    }
    return this.transitionTo('organization.repositories', owner);
  }

});
