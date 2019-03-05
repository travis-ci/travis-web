import Route from '@ember/routing/route';
import OwnerMigrateRepositoriesMixin from 'travis/mixins/route/owner/migrate/repositories';

export default Route.extend(OwnerMigrateRepositoriesMixin, {

  beforeModel() {
    this.owner = this.modelFor('organization');
    this.repositories = this.owner.webhooksRepositories;
  }

});
