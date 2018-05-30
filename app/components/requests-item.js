import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Component.extend({
  classNames: ['request-item'],
  classNameBindings: ['requestClass', 'highlightedClass'],
  tagName: 'li',

  @alias('request.result') requestClass: null,

  @computed('request.isPullRequest')
  type(isPullRequest) {
    return isPullRequest ? 'pull_request' : 'push';
  },

  @computed('highlightedRequestId', 'request.id')
  highlightedClass(paramId, currentId) {
    return (paramId === currentId) ? 'highlighted' : '';
  },

  @computed('request.result')
  status(result) {
    return result.capitalize();
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
