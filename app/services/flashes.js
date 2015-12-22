import Ember from 'ember';
import LimitedArray from 'travis/utils/limited-array';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  currentUserBinding: 'auth.currentUser',

  init() {
    this._super(...arguments);

    this.set('flashes', LimitedArray.create({
      limit: 1,
      content: []
    }));
  },

  messages: function() {
    var flashes, model;

    flashes = this.get('flashes');
    model = [];
    if (flashes) {
      model.pushObjects(flashes.toArray().reverse());
    }
    return model.uniq();
  }.property('flashes.[]', 'flashes.length'),

  loadFlashes(msgs) {
    var i, len, msg, results, type;

    results = [];
    for (i = 0, len = msgs.length; i < len; i++) {
      msg = msgs[i];
      type = Object.keys(msg)[0];
      msg = {
        type: type,
        message: msg[type]
      };
      this.get('flashes').unshiftObject(msg);
      results.push(Ember.run.later(this, (function() {
        return this.get('flashes.content').removeObject(msg);
      }), 15000));
    }
    return results;
  },

  close(msg) {
    return this.get('flashes').removeObject(msg);
  }
});
