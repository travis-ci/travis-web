import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr(),
  login: attr(),
  isSyncing: attr('boolean'),
  syncedAt: attr(),
  avatarUrl: attr(),

  githubAppsInstallationId: attr(),

  type: 'organization',
});
