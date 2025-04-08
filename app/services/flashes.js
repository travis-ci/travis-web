import { run } from '@ember/runloop';
import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { assert } from '@ember/debug';

const messageTypeToPreamble = {
  warning: 'Heads up!',
  success: 'Hooray!',
  error: 'Oh no!'
};

export default Service.extend({
  auth: service(),
  store: service(),
  storage: service(),

  currentUser: alias('auth.currentUser'),

  // This changes when scrolling to adjust flash messages to fixed
  topBarVisible: true,

  init() {
    this._super(...arguments);

    this.setup();
  },

  setup() {
    this.set('flashes', []);
  },

  messages: computed('flashes.[]', function () {
    let flashes = this.flashes;
    let model = [];
    if (flashes.length) {
      model.pushObjects(flashes.toArray());
    }
    return model.uniq();
  }),

  // TODO: when we rewrite all of the place where we use `loadFlashes` we could
  // rewrite this class and make the implementation better, because right now
  // it's really complicated for just displaying a flash message (especially
  // that we show only one at the moment anyway). We still get some error
  // messages from API responses in V2 that way, so I think that cleaning this
  // up once we're using V3 would be a good point.
  loadFlashes(flashes = []) {
    flashes.forEach(flash => {
      const type = Object.keys(flash)[0];
      const { message, preamble = messageTypeToPreamble[type], aboveOverlay } = flash[type];
      const closeButton = true;
      const item = { type, message, preamble, closeButton, aboveOverlay };

      this.flashes.unshiftObject(item);
      this.removeFlash(item);
    });
  },

  removeFlash(msg) {
    setTimeout(() => {
      run(this, () => {
        if (this.flashes.length > 0) {
          return this.flashes.removeObject(msg);
        }
      });
      // Fadeout is currently done separatly with css, and completes at 7s. Keeping the message around longer than that can result in weird situations
      // where reloading a page can result in a message showing again that you thought was gone.
    }, 15000);
  },

  close(msg) {
    return this.flashes.removeObject(msg);
  },

  clear() {
    this.setup();
  },

  display(type, message, preamble, aboveOverlay = false) {
    if (!['error', 'warning', 'success'].includes(type)) {
      // eslint-disable-next-line
      console.warn("WARNING: <service:flashes> display(type, message) function can only handle 'error', 'warning' and 'success' types");
    }

    this.loadFlashes([{ [type]: { message, preamble, aboveOverlay } }]);
  },

  success(message, preamble = messageTypeToPreamble['success'], aboveOverlay = false) {
    this.display('success', message, preamble, aboveOverlay);
  },

  error(message, preamble = messageTypeToPreamble['error'], aboveOverlay = false) {
    this.display('error', message, preamble, aboveOverlay);
  },

  warning(message, preamble = messageTypeToPreamble['warning'], aboveOverlay = false) {
    this.display('warning', message, preamble, aboveOverlay);
  },

  custom(component, data = {}, className = null) {
    assert('Component name is mandatory for custom flashes', !!component);

    const flash = { component, data, type: 'custom', className: className };

    if (!this.storage.getItem(className +  '_' + this.currentUser.id)) {
      this.flashes.unshiftObject(flash);
      this.removeFlash(flash);
      this.storage.setItem(className + '_' + this.currentUser.id, true);
    }
  },

  removeCustomsByClassName(className) {
    this.flashes.filterBy('type', 'custom').filterBy('className', className).forEach(flash => this.close(flash));
  }
});
