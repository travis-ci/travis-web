import Route from '@ember/routing/route';
import OwnerMigrateRouteMixin from 'travis/mixins/route/owner/migrate';

export default Route.extend(OwnerMigrateRouteMixin, {

  beforeModel() {
    this.account = this.modelFor('account');
  },

  redirect({ orgRepos, webhookRepos }) {
    if (webhookRepos.length > 0) {
      return this.transitionTo('account.migrate.webhooks');
    } else if (orgRepos.length > 0) {
      return this.transitionTo('account.migrate.github-apps');
    }
    return this.transitionTo('account.repositories');
  }

});
