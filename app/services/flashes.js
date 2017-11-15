import { run } from '@ember/runloop';
import Service from '@ember/service';
import LimitedArray from 'travis/utils/limited-array';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

const messageTypeToIcon = {
  notice: 'icon-flag',
  success: 'flash-success',
  error: 'flash-error'
};

const messageTypeToPreamble = {
  notice: 'Heads up!',
  success: 'Hooray!',
  error: 'Oh no!'
};

const messageTypeToCloseButton = {
  notice: true,
  success: false,
  error: true
};

export default Service.extend({
  @service auth: null,
  @service store: null,

  @alias('auth.currentUser') currentUser: null,

  // This changes when scrolling to adjust flash messages to fixed
  topBarVisible: true,

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

  @computed('flashes.[]')
  messages(flashes) {
    let model = [];
    if (flashes.length) {
      model.pushObjects(flashes.toArray().reverse());
    }
    return model.uniq();
  },

  // TODO: when we rewrite all of the place where we use `loadFlashes` we could
  // rewrite this class and make the implementation better, because right now
  // it's really complicated for just displaying a flash message (especially
  // that we show only one at the moment anyway). We still get some error
  // messages from API responses in V2 that way, so I think that cleaning this
  // up once we're using V3 would be a good point.
  loadFlashes(msgs) {
    let i, len, msg, results, type;

    results = [];
    for (i = 0, len = msgs.length; i < len; i++) {
      msg = msgs[i];
      type = Object.keys(msg)[0];

      let messageText, preamble;

      messageText = msg[type].message;
      preamble = msg[type].preamble || messageTypeToPreamble[type];

      msg = {
        type,
        message: messageText,
        icon: messageTypeToIcon[type],
        preamble,
        closeButton: messageTypeToCloseButton[type]
      };
      this.get('flashes').unshiftObject(msg);

      if (!messageTypeToCloseButton[type]) {
        this.removeFlash(msg);
      }
    }
    return results;
  },

  removeFlash(msg) {
    setTimeout(() => {
      run(this, () => {
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

  display(type, message, preamble) {
    if (!['error', 'notice', 'success'].includes(type)) {
      // eslint-disable-next-line
      console.warn("WARNING: <service:flashes> display(type, message) function can only handle 'error', 'notice' and 'success' types");
    }
    this.loadFlashes([{ [type]: { message, preamble } }]);
  },

  success(message, preamble = messageTypeToPreamble['success']) {
    this.display('success', message, preamble);
  },

  error(message, preamble = messageTypeToPreamble['error']) {
    this.display('error', message, preamble);
  },

  notice(message, preamble = messageTypeToPreamble['notice']) {
    this.display('notice', message, preamble);
  }
});
