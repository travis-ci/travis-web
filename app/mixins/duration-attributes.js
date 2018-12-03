import Mixin from '@ember/object/mixin';
import attr from 'ember-data/attr';
import { computed } from '@ember/object';

export default Mixin.create({
  _startedAt: attr(),
  _finishedAt: attr(),

  startedAt: computed('_startedAt', 'notStarted', function () {
    let startedAt = this.get('_startedAt');
    let notStarted = this.get('notStarted');
    if (!notStarted) {
      return startedAt;
    }
  }),

  finishedAt: computed('_finishedAt', 'notStarted', function () {
    let finishedAt = this.get('_finishedAt');
    let notStarted = this.get('notStarted');
    if (!notStarted) {
      return finishedAt;
    }
  })
});
