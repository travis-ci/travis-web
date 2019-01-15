import Mixin from '@ember/object/mixin';
import durationFrom from 'travis/utils/duration-from';
import { computed } from '@ember/object';

export default Mixin.create({
  duration: computed('_duration', 'finishedAt', 'startedAt', 'notStarted', function () {
    let duration = this.get('_duration');
    let finishedAt = this.get('finishedAt');
    let startedAt = this.get('startedAt');
    let notStarted = this.get('notStarted');
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
    let startedAt = this.get('startedAt');
    let finishedAt = this.get('finishedAt');
    return durationFrom(startedAt, finishedAt);
  }),
});
