import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { equal, or } from '@ember/object/computed';

export default Model.extend({
  buildsRemaining: attr(),
  owner: belongsTo('owner', { polymorphic: true }),
  permissions: attr(),
  status: attr(),

  isNew: equal('status', 'new'),
  isStarted: equal('status', 'started'),
  isEnded: equal('status', 'ended'),

  hasActiveTrial: or('isNew', 'isStarted'),
});
