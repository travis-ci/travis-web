/* global Travis */
import { scheduleOnce, run, schedule } from '@ember/runloop';

import Component from '@ember/component';
import LinesSelector from 'travis/utils/lines-selector';
import Log from 'travis/utils/log';
import LogFolder from 'travis/utils/log-folder';
import { Promise as EmberPromise } from 'rsvp';

import config from 'travis/config/environment';

import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';

const SELECTORS = {
  CONTENT: '.log-body-content',
  FIRST_HIGHLIGHT: '.log-line.highlight'
};

Log.LIMIT = config.logLimit;

Log.Scroll = function (options = {}) {
  this.beforeScroll = options.beforeScroll;
  return this;
};

Log.Scroll.prototype = Log.extend(new Log.Listener(), {
  insert() {
    if (this.numbers) {
      this.tryScroll();
    }
    return true;
  },
  tryScroll() {
    try {
      let element = document.querySelector(`${SELECTORS.CONTENT} ${SELECTORS.FIRST_HIGHLIGHT}`);
      if (element) {
        if (this.beforeScroll) {
          this.beforeScroll();
        }
        return element.scrollIntoView({ block: 'center' });
      }
    } catch (e) {}
  }
});

Log.Limit = function (maxLines, limitedLogCallback) {
  this.maxLines = maxLines || 1000;
  this.limitedLogCallback = limitedLogCallback || ((() => {}));
  return this;
};

Log.Limit.prototype = Log.extend(new Log.Listener(), {
  count: 0,
  insert(log, node) {
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
  get() {
    return this.count >= this.maxLines;
  }
});

export default Component.extend({
  auth: service(),
  permissions: service(),
  externalLinks: service(),
  router: service(),
  scroller: service(),

  classNameBindings: ['logIsVisible:is-open'],
  logIsVisible: false,

  currentUser: alias('auth.currentUser'),

  isShowingRemoveLogModal: false,

  didInsertElement() {
    if (this.get('features.debugLogging')) {
      // eslint-disable-next-line
      console.log('log view: did insert');
    }
    this._super(...arguments);
    scheduleOnce('afterRender', this, 'createEngine');
  },

  willDestroyElement() {
    if (this.get('features.debugLogging')) {
      // eslint-disable-next-line
      console.log('log view: will destroy');
    }
    scheduleOnce('afterRender', this, 'teardownLog');
  },

  teardownLog(log) {
    let parts, ref;
    if (log || (log = this.log)) {
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
    const logElement = this.element && this.element.querySelector(SELECTORS.CONTENT);
    if (logElement) {
      logElement.innerHTML = '';
    }
  },

  createEngine(log) {
    if (log || (log = this.log)) {
      this.set('limited', false);
      this.clearLogElement();
      log.onClear(() => {
        if (!this.isDestroyed && !this.isDestroying && this.element) {
          this.teardownLog();
          return this.createEngine();
        }
      });
      this.scroll = new Log.Scroll({
        beforeScroll: () => {
          this.unfoldHighlight();
        }
      });
      this.limit = new Log.Limit(Log.LIMIT, () => {
        run(() => {
          if (!this.isDestroying) {
            this.set('limited', true);
          }
        });
      });
      this.engine = Log.create({
        listeners: [this.scroll, this.limit]
      });
      this.engine.limit = this.limit;
      this.logFolder = new LogFolder(this.element.querySelector(SELECTORS.CONTENT));
      let onLogLineClick = () => {
        let router = this.router,
          currentRouteName = router.get('currentRouteName');
        if (currentRouteName === 'build.index' || currentRouteName === 'job.index') {
          return EmberPromise.resolve();
        } else {
          return router.transitionTo('job', log.get('job.repo'), log.get('job'));
        }
      };
      this.lineSelector = new LinesSelector(
        this.element.querySelector(SELECTORS.CONTENT), this.scroll, this.logFolder, null, onLogLineClick
      );
      this.observeParts(log);
    }
  },

  unfoldHighlight() {
    return this.lineSelector.unfoldLines();
  },

  observeParts(log) {
    let parts;
    if (log || (log = this.log)) {
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
    schedule('afterRender', this, function () {
      let i, j, len, part, ref, ref1, ref2, results;
      if (this.get('features.debugLogging')) {
        // eslint-disable-next-line
        console.log('log view: parts did change');
      }
      if (this._state !== 'inDOM') {
        return;
      }
      ref = parts.slice(start, start + added);
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        part = ref[i];
        // My brain can't process this right now.
        // eslint-disable-next-line
        if ((ref1 = this.engine) != null ? (ref2 = ref1.limit) != null ? ref2.limited : void 0 : void 0) {
          break;
        }
        results.push(this.engine.set(part.number, part.content));
      }
      return results;
    });
  },

  plainTextLogUrl: computed('log.plainTextUrl', function () {
    let url = this.get('log.plainTextUrl');
    return `${config.apiEndpoint}${url}`;
  }),

  hasPermission: computed('permissions.all', 'job.repo', function () {
    let repo = this.get('job.repo');
    return this.permissions.hasPermission(repo);
  }),

  canRemoveLog: computed('job', 'job.canRemoveLog', 'hasPermission', function () {
    let job = this.job;
    let canRemoveLog = this.get('job.canRemoveLog');
    let hasPermission = this.hasPermission;
    if (job) {
      return canRemoveLog && hasPermission;
    }
  }),

  showToTop: and('log.hasContent', 'job.canRemoveLog'),

  showTailing: alias('showToTop'),

  actions: {
    toTop() {
      Travis.tailing.stop();
      const { pageYOffset = 0 } = window;
      return this.scroller.scrollTo(pageYOffset, 0, { duration: 100 });
    },

    toggleTailing() {
      Travis.tailing.toggle();
      this.engine.autoCloseFold = !Travis.tailing.isActive();
      return false;
    },

    toggleLog() {
      this.toggleProperty('logIsVisible');
    },

    toggleRemoveLogModal() {
      this.toggleProperty('isShowingRemoveLogModal');
    },
  },

  // don't remove this, it's needed as an empty willChange callback
  noop() {}
});
