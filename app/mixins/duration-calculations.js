import Ember from 'ember';
import { durationFrom } from 'travis/utils/helpers';

export default Ember.Mixin.create({
  duration: function() {
    var duration;
    if (this.get('notStarted')) {
      return null;
    } else if (duration = this.get('_duration')) {
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
