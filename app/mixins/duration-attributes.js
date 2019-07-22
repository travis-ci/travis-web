import Mixin from '@ember/object/mixin';
import { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Mixin.create({
  _startedAt: attr(),
  _finishedAt: attr(),

  startedAt: computed('_startedAt', 'notStarted', function () {
    let startedAt = this._startedAt;
    let notStarted = this.notStarted;
    if (!notStarted) {
      return startedAt;
    }
  }),

  finishedAt: computed('_finishedAt', 'notStarted', function () {
    let finishedAt = this._finishedAt;
    let notStarted = this.notStarted;
    if (!notStarted) {
      return finishedAt;
    }
  })
});
