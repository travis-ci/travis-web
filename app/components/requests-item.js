import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['request-item'],
  classNameBindings: ['requestClass'],
  tagName: 'li',

  isGHPages: Ember.computed('request.message', function () {
    let message = this.get('request.message');
    if (message === 'github pages branch') {
      return true;
    } else {
      return false;
    }
  }),

  requestClass: Ember.computed('content.isAccepted', function () {
    if (this.get('request.isAccepted')) {
      return 'accepted';
    } else {
      return 'rejected';
    }
  }),

  type: Ember.computed('request.isPullRequest', function () {
    if (this.get('request.isPullRequest')) {
      return 'pull_request';
    } else {
      return 'push';
    }
  }),

  status: Ember.computed('request.isAccepted', function () {
    if (this.get('request.isAccepted')) {
      return 'Accepted';
    } else {
      return 'Rejected';
    }
  }),

  message: Ember.computed('features.proVersion', 'request.message', function () {
    let message = this.get('request.message');
    if (this.get('features.proVersion') && message === 'private repository') {
      return '';
    } else if (!message) {
      return 'Build created successfully ';
    } else {
      return message;
    }
  })
});
