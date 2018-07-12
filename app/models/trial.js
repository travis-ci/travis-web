import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo} from 'ember-data/relationships';
import { and, equal, or } from 'ember-decorators/object/computed';

export default Model.extend({
  buildsRemaining: attr(),
  owner: belongsTo('owner', { polymorphic: true }),
  status: attr(),

  @equal('status', 'new') isNew: null,
  @equal('status', 'started') isStarted: null,
  @equal('status', 'ended') isEnded: null,

  @or('isNew', 'isStarted') hasTrial: null,
});
