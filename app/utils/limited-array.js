import Ember from 'ember';
import limit from 'travis/utils/computed-limit';

export default Ember.ArrayProxy.extend({
  limit: 10,
  isLoadedBinding: 'content.isLoaded',
  arrangedContent: limit('content', 'limit'),

  totalLength: function() {
    return this.get('content.length');
  }.property('content.length'),

  leftLength: function() {
    var left, limit, totalLength;
    totalLength = this.get('totalLength');
    limit = this.get('limit');
    left = totalLength - limit;
    if (left < 0) {
      return 0;
    } else {
      return left;
    }
  }.property('totalLength', 'limit'),

  isMore: function() {
    return this.get('leftLength') > 0;
  }.property('leftLength'),

  showAll() {
    return this.set('limit', Infinity);
  }
});
