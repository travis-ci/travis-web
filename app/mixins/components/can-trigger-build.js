import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { equal, or, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Mixin.create({
  features: service(),

  canCreateRequest: reads('repo.permissions.create_request'),
  proVersion: reads('features.proVersion'),
  enterpriseVersion: reads('features.enterpriseVersion'),
  proOrEnterprise: or('proVersion', 'enterpriseVersion'),
  repoMigrated: equal('repo.migrationStatus', 'migrated'),

  canTriggerBuild: computed('canCreateRequest', 'isOrg', 'repoMigrated', function () {
    return this.canCreateRequest && (this.proOrEnterprise || !this.repoMigrated);
  }),
});
