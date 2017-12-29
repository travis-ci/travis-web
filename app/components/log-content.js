/* global Travis */
import { scheduleOnce, run, schedule } from '@ember/runloop';

import Component from '@ember/component';
import $ from 'jquery';
import LinesSelector from 'travis/utils/lines-selector';
import Log from 'travis/utils/log';
import LogFolder from 'travis/utils/log-folder';
import { Promise as EmberPromise } from 'rsvp';

import config from 'travis/config/environment';

import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

Log.LIMIT = config.logLimit;

Log.Scroll = function (options = {}) {
  this.beforeScroll = options.beforeScroll;
  return this;
};

Log.Scroll.prototype = $.extend(new Log.Listener(), {
  insert() {
    if (this.numbers) {
      this.tryScroll();
    }
    return true;
  },
  tryScroll() {
    let ref;
    let element = $('#log .log-line:visible.highlight:first');
    if (element) {
      if (this.beforeScroll) {
        this.beforeScroll();
      }
      $('#main').scrollTop(0);
      let offset = element.offset();
      let scrollTop = ((ref = offset) != null ? ref.top : void 0) - (window.innerHeight / 3);
      return $('html, body').scrollTop(scrollTop);
    }
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
  @service auth: null,
  @service permissions: null,
  @service externalLinks: null,
  @service router: null,

  classNameBindings: ['logIsVisible:is-open', 'isFullScreenLog:is-fullscreen'],
  logIsVisible: false,
  isFullScreenLog: false,

  @alias('auth.currentUser') currentUser: null,

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
    let logElement = this.$('#log');
    if (logElement && logElement[0]) {
      logElement[0].innerHTML = '';
    }
  },

  createEngine(log) {
    if (log || (log = this.get('log'))) {
      this.set('limited', false);
      this.clearLogElement();
      log.onClear(() => {
        this.teardownLog();
        return this.createEngine();
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
      this.logFolder = new LogFolder(this.$('#log'));
      let onLogLineClick = () => {
        let router = this.get('router'),
          currentRouteName = router.get('currentRouteName');
        if (currentRouteName === 'build.index' || currentRouteName === 'job.index') {
          return EmberPromise.resolve();
        } else {
          return router.transitionTo('job', log.get('job.repo'), log.get('job'));
        }
      };
      this.lineSelector = new LinesSelector(
        this.$('#log'), this.scroll, this.logFolder, null, onLogLineClick
      );
      this.observeParts(log);
    }
  },

  didUpdateAttrs() {
    let oldJob = this.get('_oldJob');
    let newJob = this.get('job');

    if (oldJob && (oldJob.get('id') != newJob.get('id'))) {
      this.teardownLog(oldJob.get('log'));
      return this.createEngine(newJob.get('log'));
    }

    this.set('_oldJob', this.get('job'));
  },

  unfoldHighlight() {
    return this.lineSelector.unfoldLines();
  },

  observeParts(log) {
    let parts;
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
    schedule('afterRender', this, function () {
      let i, j, len, part, ref, ref1, ref2, results;
      if (this.get('features.debugLogging')) {
        // eslint-disable-next-line
        console.log('log view: parts did change');
      }
      if (this.get('_state') !== 'inDOM') {
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

  @computed('log.plainTextUrl')
  plainTextLogUrl(url) {
    return `${config.apiEndpoint}${url}`;
  },

  @computed('permissions.all', 'job.repo')
  hasPermission(permissions, repo) {
    return this.get('permissions').hasPermission(repo);
  },

  @computed('job', 'job.canRemoveLog', 'hasPermission')
  canRemoveLog(job, canRemoveLog, hasPermission) {
    if (job) {
      return canRemoveLog && hasPermission;
    }
  },

  @computed('log.hasContent', 'job.canRemoveLog')
  showToTop(hasContent, canRemoveLog) {
    return hasContent && canRemoveLog;
  },

  @alias('showToTop') showTailing: null,

  actions: {
    toTop() {
      Travis.tailing.stop();
      if (this.get('isFullScreenLog')) {
        return $('.log').scrollTop(0);
      } else {
        return $(window).scrollTop(0);
      }
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

    toggleFullScreenLog() {
      this.toggleProperty('isFullScreenLog');
    }
  },

  // don't remove this, it's needed as an empty willChange callback
  noop() {}
});
