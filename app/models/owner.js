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
  // FIXME these seem like they should just be subscription
  expiredSubscription: attr(),
  canceledSubscription: attr(),

  installation: belongsTo({async: false}),

  // This is set by serializers:subscription
  subscriptionPermissions: attr(),
});
