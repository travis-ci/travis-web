/* global Travis, Log */
import Ember from 'ember';
import LinesSelector from 'travis/utils/lines-selector';
import LogFolder from 'travis/utils/log-folder';
import config from 'travis/config/environment';
import { plainTextLog as plainTextLogUrl } from 'travis/utils/urls';

const { service } = Ember.inject;
const { alias } = Ember.computed;

Log.DEBUG = false;

Log.LIMIT = 10000;

Log.Scroll = function (options) {
  options = options || {};
  this.beforeScroll = options.beforeScroll;
  return this;
};

Log.Scroll.prototype = Ember.$.extend(new Log.Listener(), {
  insert: function () {
    if (this.numbers) {
      this.tryScroll();
    }
    return true;
  },
  tryScroll: function () {
    var ref;
    let element = Ember.$('#log p:visible.highlight:first');
    if (element) {
      if (this.beforeScroll) {
        this.beforeScroll();
      }
      Ember.$('#main').scrollTop(0);
      return Ember.$('html, body').scrollTop(((ref = element.offset()) != null ? ref.top : void 0) - (window.innerHeight / 3));
    }
  }
});

Log.Limit = function (maxLines, limitedLogCallback) {
  this.maxLines = maxLines || 1000;
  this.limitedLogCallback = limitedLogCallback || (function () {});
  return this;
};

Log.Limit.prototype = Log.extend(new Log.Listener(), {
  count: 0,
  insert: function (node) {
    if (node.type === 'paragraph' && !node.hidden) {
      this.count += 1;
      if (this.limited) {
        this.limitedLogCallback();
      }
      return this.count;
    }
  }
});

Object.defineProperty(Log.Limit.prototype, 'limited', {
  get: function () {
    return this.count >= this.maxLines;
  }
});

export default Ember.Component.extend({
  auth: service(),
  popup: service(),
  permissions: service(),
  classNameBindings: ['logIsVisible:is-open'],
  logIsVisible: false,

  currentUser: alias('auth.currentUser'),

  didInsertElement() {
    if (Log.DEBUG) {
      //eslint-disable-next-line
      console.log('log view: did insert');
    }
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, 'createEngine');
  },

  willDestroyElement() {
    if (Log.DEBUG) {
      //eslint-disable-next-line
      console.log('log view: will destroy');
    }
    Ember.run.scheduleOnce('afterRender', this, 'teardownLog');
  },

  teardownLog(log) {
    var parts, ref;
    if (log || (log = this.get('log'))) {
      parts = log.get('parts');
      parts.removeArrayObserver(this, {
        didChange: 'partsDidChange',
        willChange: 'noop'
      });
      parts.destroy();
      log.notifyPropertyChange('parts');
      if ((ref = this.lineSelector) != null) {
        ref.willDestroy();
      }
      this.clearLogElement();
    }
  },

  clearLogElement() {
    var logElement = this.$('#log');
    if (logElement && logElement[0]) {
      logElement[0].innerHTML = '';
    }
  },

  createEngine(log) {
    if (log || (log = this.get('log'))) {
      this.clearLogElement();
      log.onClear(() => {
        this.teardownLog();
        return this.createEngine();
      });
      this.scroll = new Log.Scroll({
        beforeScroll: () => {
          return this.unfoldHighlight();
        }
      });
      this.limit = new Log.Limit(Log.LIMIT, () => {
        return this.set('limited', true);
      });
      this.engine = Log.create({
        listeners: [this.scroll, this.limit]
      });
      this.engine.limit = this.limit;
      this.logFolder = new LogFolder(this.$('#log'));
      this.lineSelector = new LinesSelector(this.$('#log'), this.scroll, this.logFolder);
      this.observeParts(log);
    }
  },

  didUpdateAttrs(changes) {
    this._super(...arguments);
    if (!changes.oldAttrs) {
      return;
    }
    if (changes.newAttrs.job.value && changes.oldAttrs.job.value && changes.newAttrs.job.value !== changes.oldAttrs.job.value) {
      this.teardownLog(changes.oldAttrs.job.value.get('log'));
      return this.createEngine(changes.newAttrs.job.value.get('log'));
    }
  },

  unfoldHighlight() {
    return this.lineSelector.unfoldLines();
  },

  observeParts(log) {
    var parts;
    if (log || (log = this.get('log'))) {
      parts = log.get('parts');
      parts.addArrayObserver(this, {
        didChange: 'partsDidChange',
        willChange: 'noop'
      });
      parts = parts.slice(0);
      this.partsDidChange(parts, 0, null, parts.length);
    }
  },

  partsDidChange(parts, start, _, added) {
    Ember.run.schedule('afterRender', this, function () {
      var i, j, len, part, ref, ref1, ref2, results;
      if (Log.DEBUG) {
        //eslint-disable-next-line
        console.log('log view: parts did change');
      }
      if (this.get('_state') !== 'inDOM') {
        return;
      }
      ref = parts.slice(start, start + added);
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        part = ref[i];
        if ((ref1 = this.engine) != null ? (ref2 = ref1.limit) != null ? ref2.limited : void 0 : void 0) {
          break;
        }
        results.push(this.engine.set(part.number, part.content));
      }
      return results;
    });
  },

  plainTextLogUrl: Ember.computed('job.log.id', 'job.log.token', function () {
    let id = this.get('log.job.id');
    if (id) {
      let url = plainTextLogUrl(id);
      if (config.pro) {
        url += '&access_token=' + (this.get('job.log.token'));
      }
      return url;
    }
  }),

  hasPermission: Ember.computed('permissions.all', 'job.repo', function () {
    return this.get('permissions').hasPermission(this.get('job.repo'));
  }),

  canRemoveLog: Ember.computed('job.canRemoveLog', 'hasPermission', function () {
    let job = this.get('job');
    if (job) {
      return job.get('canRemoveLog') && this.get('hasPermission');
    }
  }),

  showToTop: Ember.computed('log.hasContent', 'job.canRemoveLog', function () {
    return this.get('log.hasContent') && this.get('job.canRemoveLog');
  }),

  showTailing: Ember.computed.alias('showToTop'),

  actions: {
    toTop() {
      Travis.tailing.stop();
      return Ember.$(window).scrollTop(0);
    },

    toggleTailing() {
      Travis.tailing.toggle();
      this.engine.autoCloseFold = !Travis.tailing.isActive();
      return false;
    },

    removeLogPopup() {
      if (this.get('canRemoveLog')) {
        this.get('popup').open('remove-log-popup');
        return false;
      }
    },

    toggleLog() {
      this.toggleProperty('logIsVisible');
    }
  },

  // don't remove this, it's needed as an empty willChange callback
  noop: function () {}
});
