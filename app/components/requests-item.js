import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  classNames: ['request-item'],
  classNameBindings: ['requestClass'],
  tagName: 'li',

  isGHPages: function() {
    var message = this.get('request.message');
    if (message === 'github pages branch') {
      return true;
    } else {
      return false;
    }
  }.property('request.message'),

  requestClass: function() {
    if (this.get('request.isAccepted')) {
      return 'accepted';
    } else {
      return 'rejected';
    }
  }.property('content.isAccepted'),

  type: function() {
    if (this.get('request.isPullRequest')) {
      return 'pull_request';
    } else {
      return 'push';
    }
  }.property('request.isPullRequest'),

  status: function() {
    if (this.get('request.isAccepted')) {
      return 'Accepted';
    } else {
      return 'Rejected';
    }
  }.property('request.isAccepted'),

  hasBranchName: function() {
    return this.get('request.branchName');
  }.property('request'),

  message: function() {
    var message;
    message = this.get('request.message');
    if (config.pro && message === "private repository") {
      return '';
    } else if (!message) {
      return 'Build created successfully ';
    } else {
      return message;
    }
  }.property('request.message')
});
