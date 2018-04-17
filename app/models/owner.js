import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr(),
  login: attr(),
  isSyncing: attr('boolean'),
  syncedAt: attr(),
  avatarUrl: attr(),
  githubId: attr(),

  installation: belongsTo({async: false}),
});
