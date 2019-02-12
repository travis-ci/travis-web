import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    const owner = this.modelFor('account');
    return owner.githubAppsRepositoriesOnOrg.load();
  }

});

