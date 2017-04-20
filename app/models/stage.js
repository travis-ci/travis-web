import Model from 'ember-data/model';
import Ember from 'ember';

import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

import DurationCalculations from 'travis/mixins/duration-calculations';

export default Model.extend(DurationCalculations, {
  build: belongsTo({ async: true }),

  number: attr(),
  name: attr(),

  state: attr(),

  notStarted: Ember.computed('state', function () {
    let state = this.get('state');
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.includes(state);
  }),

  _startedAt: attr(),
  _finishedAt: attr(),

  startedAt: Ember.computed('_startedAt', 'notStarted', function () {
    if (!this.get('notStarted')) {
      return this.get('_startedAt');
    }
  }),

  finishedAt: Ember.computed('_finishedAt', 'notStarted', function () {
    if (!this.get('notStarted')) {
      return this.get('_finishedAt');
    }
  })
});
