import Ember from 'ember';
import attr from 'ember-data/attr';

export default Ember.Mixin.create({
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
