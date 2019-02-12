import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({

  account: null,

  beforeModel({ targetName }) {
    const isOrganization = targetName.indexOf('organization') > -1;
    const accountRouteName = isOrganization ? 'organization' : 'account';
    this.account = this.modelFor(accountRouteName);
  },

  model() {
    const { githubAppsRepositoriesOnOrg, webhooksRepositories } = this.account;

    return hash({
      orgRepos: githubAppsRepositoriesOnOrg.promise,
      webhookRepos: webhooksRepositories.promise
    });
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
