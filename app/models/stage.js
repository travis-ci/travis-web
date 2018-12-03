import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import DurationCalculations from 'travis/mixins/duration-calculations';
import DurationAttributes from 'travis/mixins/duration-attributes';

export default Model.extend(DurationCalculations, DurationAttributes, {
  number: attr(),
  name: attr(),
  state: attr(),

  build: belongsTo({ async: true }),

  notStarted: computed('state', function () {
    let state = this.get('state');
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.includes(state);
  }),
});
