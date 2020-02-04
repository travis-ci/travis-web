import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { reads, match, sort } from '@ember/object/computed';
import { debounce } from '@ember/runloop';
import { task, timeout } from 'ember-concurrency';
import { pluralize } from 'ember-inflector';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import BranchSearching from 'travis/mixins/branch-searching';

const MSGS = {
  'alert': 'alert',
  'error': 'error',
  'warn': 'warning',
  'info': 'info',
};

function formatLevel(level, count) {
  return pluralize(count, MSGS[level]);
}

function sortOrder(level) {
  return Object.keys(MSGS).indexOf(level);
}

function countBy(objs, name) {
  return objs.reduce((counts, obj) => {
    if (!counts[obj[name]]) {
      counts[obj[name]] = 0;
    }
    counts[obj[name]] += 1;
    return counts;
  }, {});
}

export default Component.extend(BranchSearching, {
  tagName: 'div',
  classNames: ['request-configs'],
  classNameBindings: ['status', 'processing', 'validationExpanded:validation-expanded'],

  api: service(),
  flashes: service(),
  router: service(),
  yml: service(),

  status: 'closed',
  processing: false,
  mergeMode: 'deep_merge_append',
  repo: reads('request.repo'),
  closed: match('status', /closed/),
  customize: match('status', /customize/),
  replacing: match('mergeMode', /replace/),
  validationExpanded: false,

  config: undefined,
  branch: reads('request.repo.defaultBranch.name'),
  sha: reads('request.commit.sha'),
  message: reads('request.commit.message'),

  displayTriggerBuild: computed(
    'repo.migrationStatus',
    'repo.permissions.create_request',
    'features.{enterpriseVersion,proVersion}',
    function () {
      let migrationStatus = this.get('repo.migrationStatus');
      let canTriggerBuild = this.get('repo.permissions.create_request');
      let enterprise = this.get('features.enterpriseVersion');
      let pro = this.get('features.proVersion');

      if (enterprise || pro) {
        return canTriggerBuild;
      }
      return canTriggerBuild && migrationStatus !== 'migrated';
    }
  ),

  displayValidationMessages: computed('validationMessages', 'validationExpanded', function () {
    return this.validationMessages && this.validationMessages.length > 0 && this.validationExpanded;
  }),

  toggleValidationMessages: function () {
    this.toggleProperty('validationExpanded');
  },

  configChanged: observer('config', function () {
    if (!this.validating) {
      debounce(this, this.validate, 750);
    }
  }),

  validate: function () {
    this.set('validating', true);
    this.yml.validate(this.config).then(data => {
      let error = data.messages.find(msg =>  msg.level == 'error' || msg.level == 'alert');
      this.set('validationMessages', data.messages);
      this.set('validationResult', error ? error.level : 'valid');
      this.set('validationResultLevel', this.get('validationMaxLevel'));
    },
    () => {
      this.set('validationMessages', undefined);
      this.set('validationResult', 'Invalid format');
      this.set('validationResultLevel', 'error');
    }).finally(() => {
      this.set('validating', false);
    });
  },

  validationMaxLevel: computed('sortedMessages', function () {
    return this.get('sortedMessages.firstObject.level') || 'info';
  }),

  validationSummary: computed('sortedMessages', function () {
    let counts = countBy(this.get('sortedMessages'), 'level');
    if (Object.entries(counts).length > 0) {
      return Object.entries(counts).map((entry) => formatLevel(...entry)).join(', ');
    }
  }),

  sortedMessages: sort('validationMessages', (lft, rgt) =>
    sortOrder(lft.level) - sortOrder(rgt.level)
  ),

  maxLevel: computed('sortedMessages', function () {
    return this.get('sortedMessages.firstObject.level') || 'info';
  }),

  iconClass: computed('maxLevel', function () {
    return `icon icon-${this.get('maxLevel')}`;
  }),

  summary: computed('sortedMessages', function () {
    let counts = countBy(this.get('sortedMessages'), 'level');
    if (Object.entries(counts).length > 0) {
      return Object.entries(counts).map((entry) => formatLevel(...entry)).join(', ');
    }
  }),

  searchBranches: task(function* (query) {
    const result = yield this.searchBranch.perform(this.get('repo.id'), query);
    return result.mapBy('name');
  }),

  rawConfigsCount: computed('request.rawConfigs', 'customize', function () {
    let configs = this.get('request.uniqRawConfigs');
    if (this.customize) {
      configs = configs.reject(config => config.source.includes('api'));
    }
    return configs.length;
  }),

  onTriggerBuild: function (e) {
    e.toElement.blur();
    if (this.status == 'closed') {
      this.set('status', 'open');
    } else if (this.status == 'open' || this.status == 'customize') {
      this.set('processing', true);
      this.triggerBuild.perform();
    }
  },

  onCancel: function () {
    if (this.status == 'open' || this.status == 'customize') {
      this.set('status', 'closed');
    }
  },

  onCustomize: function () {
    if (this.status == 'open') {
      this.set('status', 'customize');
      if (typeof this.config === 'undefined') {
        this.set('config', this.get('apiConfig'));
      }
    } else if (this.status == 'customize') {
      this.set('status', 'open');
    }
  },

  configMode: computed('config', function () {
    if (this.config && this.config[0] == '{') {
      return 'javascript';
    } else {
      return 'yaml';
    }
  }),

  configType: computed('configMode', function () {
    if (this.configMode == 'javascript') {
      return 'JSON';
    } else {
      return 'YAML';
    }
  }),

  apiConfig: computed('request.rawConfigs', function () {
    const config = this.get('request.uniqRawConfigs').find((config) => config.source.includes('api'));
    if (config && config.config !== '{}') {
      return config.config;
    }
  }),

  triggerBuild: task(function* () {
    const data = yield this.createBuild.perform();

    if (data) {
      let requestId = data.request.id;
      let { delay } = config.intervals;
      yield timeout(delay);
      yield this.showRequestStatus.perform(this.get('repo.id'), requestId);
    }
  }),

  createBuild: task(function* () {
    try {
      const body = this.requestBody();
      return yield this.api.post(`/repo/${this.get('repo.id')}/requests`, { data: body });
    } catch (e) {
      this.displayError(e);
    }
  }),

  requestBody() {
    const { branch, sha, config, message, mergeMode } = this;

    return {
      request: {
        branch,
        sha,
        config,
        message,
        merge_mode: mergeMode
      }
    };
  },

  showRequestStatus: task(function* (repoId, requestId) {
    const data = yield this.buildStatus.perform(repoId, requestId);
    let { result } = data;
    let [build] = data.builds;

    if (build && result === 'approved') {
      return this.showBuild(build);
    } else if (result === 'rejected') {
      return this.showFailedRequest(requestId);
    }
    return this.showProcessingRequest(requestId);
  }),

  buildStatus: task(function* (repoId, requestId) {
    try {
      return yield this.api.get(`/repo/${repoId}/request/${requestId}`);
    } catch (e) {
      this.displayError(e);
    }
  }),

  showProcessingRequest(requestId) {
    const preamble = 'Hold tight!';
    const notice = `You successfully triggered a build for ${this.get('repo.slug')}. It might take a moment to show up though.`;
    this.flashes.notice(notice, preamble);
    return this.showRequest(requestId);
  },

  showFailedRequest(requestId) {
    const errorMsg = `You tried to trigger a build for ${this.get('repo.slug')} but the request was rejected.`;
    this.flashes.error(errorMsg);
    return this.showRequest(requestId);
  },

  showRequest(requestId) {
    const queryParams = { requestId };
    return this.router.transitionTo('requests', this.repo, { queryParams });
  },

  showBuild(build) {
    return this.router.transitionTo('build', this.repo, build.id);
  },

  displayError(e) {
    let message;

    if (e.status === 429) {
      message = 'You’ve exceeded the limit for triggering builds, please wait a while before trying again.';
    } else {
      message = 'Oops, something went wrong, please try again.';
    }

    this.flashes.error(message);
  },

  actions: {
    setConfig: function (config) {
      this.set('config', config.replace(/\t/gm, '  '));
    }
  }
});

