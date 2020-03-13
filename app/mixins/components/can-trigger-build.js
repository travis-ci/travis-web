import Mixin from '@ember/object/mixin';
import { and, equal, not, reads } from '@ember/object/computed';

export default Mixin.create({
  canCreateRequest: reads('repo.permissions.create_request'),
  repoMigrating: equal('repo.MigrationStatus', 'migrated'),
  repoNotMigrating: not('repoMigrating'),
  canTriggerBuild: and('canCreateRequest', 'repoNotMigrating'),
});
