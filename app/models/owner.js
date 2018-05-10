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
  education: attr('boolean'),

  // These are inserted artificially by routes:accounts
  subscription: attr(),
  subscriptionError: attr('boolean'),

  installation: belongsTo({async: false}),
});
