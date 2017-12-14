import Mixin from '@ember/object/mixin';
import durationFrom from 'travis/utils/duration-from';
import { computed } from 'ember-decorators/object';

export default Mixin.create({
  @computed('_duration', 'finishedAt', 'startedAt', 'notStarted')
  duration(duration, finishedAt, startedAt, notStarted) {
    if (notStarted) {
      return null;
    } else if (duration) {
      return duration;
    } else {
      return durationFrom(startedAt, finishedAt);
    }
  },

  updateTimes() {
    this.notifyPropertyChange('duration');
    return this.notifyPropertyChange('finishedAt');
  },
});
