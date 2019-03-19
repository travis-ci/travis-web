import Route from '@ember/routing/route';
import OwnerMigrateMixin from 'travis/mixins/route/owner/migrate';

export default Route.extend(OwnerMigrateMixin, {

  model() {
    this._super(...arguments);
    return this.modelFor('organization');
  }

});
