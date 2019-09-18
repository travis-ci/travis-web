import Model, { attr, belongsTo } from '@ember-data/model';
import { equal, or } from '@ember/object/computed';

export default Model.extend({
  buildsRemaining: attr(),
  owner: belongsTo('owner', { polymorphic: true }),
  permissions: attr(),
  status: attr(),
  type: attr(),
  isNew: equal('status', 'new'),
  isStarted: equal('status', 'started'),
  isEnded: equal('status', 'ended'),

  hasActiveTrial: or('isNew', 'isStarted'),
});
