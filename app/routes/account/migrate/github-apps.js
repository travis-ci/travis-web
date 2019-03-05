import Route from '@ember/routing/route';
import OwnerMigrateRepositoriesMixin from 'travis/mixins/route/owner/migrate/repositories';

export default Route.extend(OwnerMigrateRepositoriesMixin, {

  beforeModel() {
    this.owner = this.modelFor('account');
    this.repositories = this.owner.githubAppsRepositoriesOnOrg;
  }

});

