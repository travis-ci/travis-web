import Ember from 'ember';
import limit from 'travis/utils/computed-limit';

const { alias } = Ember.computed;

export default Ember.ArrayProxy.extend({
  limit: 10,
  isLoaded: alias('content.isLoaded'),
  arrangedContent: limit('content', 'limit'),

  totalLength: Ember.computed('content.length', function () {
    return this.get('content.length');
  }),

  leftLength: Ember.computed('totalLength', 'limit', function () {
    var left, limit, totalLength;
    totalLength = this.get('totalLength');
    limit = this.get('limit');
    left = totalLength - limit;
    if (left < 0) {
      return 0;
    } else {
      return left;
    }
  }),

  isMore: Ember.computed('leftLength', function () {
    return this.get('leftLength') > 0;
  }),

  showAll() {
    return this.set('limit', Infinity);
  }
});
