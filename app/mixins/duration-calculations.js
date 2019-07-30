import Mixin from '@ember/object/mixin';
import durationFrom from 'travis/utils/duration-from';
import { computed } from '@ember/object';

export default Mixin.create({
  duration: computed('_duration', 'finishedAt', 'startedAt', 'notStarted', function () {
    let duration = this._duration;
    let finishedAt = this.finishedAt;
    let startedAt = this.startedAt;
    let notStarted = this.notStarted;
    if (notStarted) {
      return null;
    } else if (duration) {
      return duration;
    } else {
      return durationFrom(startedAt, finishedAt);
    }
  }),

  updateTimes() {
    this.notifyPropertyChange('duration');
    return this.notifyPropertyChange('finishedAt');
  },

  elapsedTime: computed('startedAt', 'finishedAt', function () {
    let startedAt = this.startedAt;
    let finishedAt = this.finishedAt;
    return durationFrom(startedAt, finishedAt);
  }),
});
