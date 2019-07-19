import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import DurationCalculations from 'travis/mixins/duration-calculations';
import DurationAttributes from 'travis/mixins/duration-attributes';

export default Model.extend(DurationCalculations, DurationAttributes, {
  number: attr(),
  name: attr('string'),
  state: attr(),

  build: belongsTo('build', { async: true }),

  notStarted: computed('state', function () {
    let state = this.state;
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.includes(state);
  }),
});
