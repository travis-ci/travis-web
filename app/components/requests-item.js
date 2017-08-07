import Ember from 'ember';
import { computed } from 'ember-decorators/object';

export default Ember.Component.extend({
  classNames: ['request-item'],
  classNameBindings: ['requestClass'],
  tagName: 'li',

  @computed('request.message')
  isGHPages(message) {
    return message === 'github pages branch';
  },

  @computed('request.isAccepted')
  requestClass(isAccepted) {
    return isAccepted ? 'accepted' : 'rejected';
  },

  @computed('request.isPullRequest')
  type(isPullRequest) {
    return isPullRequest ? 'pull_request' : 'push';
  },

  @computed('request.isAccepted')
  status(isAccepted) {
    return isAccepted ? 'Accepted' : 'Rejected';
  },

  @computed('features.proVersion', 'request.message')
  message(proVersion, message) {
    if (proVersion && message === 'private repository') {
      return '';
    } else if (!message) {
      return 'Build created successfully ';
    }
    return message;
  },
});
