import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  classNames: ['request-item'],
  classNameBindings: ['requestClass', 'highlightedClass'],
  tagName: 'li',

  requestClass: reads('request.result'),

  build: reads('request.build'),

  type: computed('request.isPullRequest', function () {
    let isPullRequest = this.get('request.isPullRequest');
    return isPullRequest ? 'pull_request' : 'push';
  }),

  highlightedClass: computed('highlightedRequestId', 'request.id', function () {
    let paramId = this.highlightedRequestId;
    let currentId = this.get('request.id');
    return (paramId === currentId) ? 'highlighted' : '';
  }),

  status: computed('request.result', function () {
    let result = this.get('request.result');
    return result.capitalize();
  }),

  message: computed('features.proVersion', 'request.message', function () {
    let proVersion = this.get('features.proVersion');
    let message = this.get('request.message');
    if (proVersion && message === 'private repository') {
      return '';
    } else if (!message) {
      return 'Build created successfully ';
    }
    return message;
  }),
});
