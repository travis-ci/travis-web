import Model from 'ember-data/model';
import Ember from 'ember';

import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

import DurationCalculations from 'travis/mixins/duration-calculations';
import DurationAttributes from 'travis/mixins/duration-attributes';

export default Model.extend(DurationCalculations, DurationAttributes, {
  build: belongsTo({ async: true }),

  number: attr(),
  name: attr(),

  state: attr(),

  notStarted: Ember.computed('state', function () {
    let state = this.get('state');
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.includes(state);
  })
});
