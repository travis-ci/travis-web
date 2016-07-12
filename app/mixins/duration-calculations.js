import Ember from 'ember';
import { durationFrom } from 'travis/utils/helpers';

export default Ember.Mixin.create({
  duration: function() {
    let duration = this.get('_duration');
    if (this.get('notStarted')) {
      return null;
    } else if (duration) {
      return duration;
    } else {
      return durationFrom(this.get('startedAt'), this.get('finishedAt'));
    }
  }.property('_duration', 'finishedAt', 'startedAt', 'notStarted', '_finishedAt', '_startedAt'),

  updateTimes() {
    this.notifyPropertyChange('duration');
    return this.notifyPropertyChange('finishedAt');
  }
});
