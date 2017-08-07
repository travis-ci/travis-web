import Ember from 'ember';
import limit from 'travis/utils/computed-limit';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.ArrayProxy.extend({
  limit: 10,

  arrangedContent: limit('content', 'limit'),

  @alias('content.isLoaded') isLoaded: null,

  @alias('content.length') totalLength: null,

  @computed('totalLength', 'limit')
  leftLength(total, limit) {
    const left = total - limit;
    if (left < 0) {
      return 0;
    } else {
      return left;
    }
  },

  @computed('leftLength')
  isMore(leftLength) {
    return leftLength > 0;
  },

  showAll() {
    return this.set('limit', Infinity);
  }
});
