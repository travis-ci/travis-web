import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['request-icon', 'icon'],
  classNameBindings: ['event', 'state'],

  isPush: Ember.computed('event', function () {
    return this.get('event') === 'push';
  }),

  isPR: Ember.computed('event', function () {
    return this.get('event') === 'pull_request';
  }),

  isCron: Ember.computed('event', function () {
    return this.get('event') === 'cron';
  }),

  isAPI: Ember.computed('event', function () {
    return this.get('event') === 'api';
  }),

  isEmpty: Ember.computed('event', function () {
    if (this.get('event') === null || this.get('event') === null) {
      return true;
    }
  })
});
