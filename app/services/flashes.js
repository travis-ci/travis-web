import Ember from 'ember';
import LimitedArray from 'travis/utils/limited-array';

export default Ember.Service.extend({
  currentUserBinding: 'auth.currentUser',

  init() {
    this._super(...arguments);

    this.setup();
  },

  setup() {
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

  // TODO: when we rewrite all of the place where we use `loadFlashes` we could
  // rewrite this class and make the implementation better, because right now
  // it's really complicated for just displaying a flash message (especially
  // that we show only one at the moment anyway). We still get some error
  // messages from API responses in V2 that way, so I think that cleaning this
  // up once we're using V3 would be a good point.
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
      this.removeFlash(msg);
    }
    return results;
  },

  removeFlash(msg) {
    setTimeout(() => {
      Ember.run(this, () => {
        if (this.get('flashes.content')) {
          return this.get('flashes.content').removeObject(msg);
        }
      });
    }, 15000);
  },

  close(msg) {
    return this.get('flashes').removeObject(msg);
  },

  clear() {
    this.setup();
  },

  display(type, message) {
    if(!['error', 'notice', 'success'].contains(type)) {
      console.warn("WARNING: <service:flashes> display(type, message) function can only handle 'error', 'notice' and 'success' types");
    }
    this.loadFlashes([{ [type]: message }]);
  },

  success(message) {
    this.display('success', message);
  },

  error(message) {
    this.display('error', message);
  },

  notice(message) {
    this.display('notice', message);
  }
});
