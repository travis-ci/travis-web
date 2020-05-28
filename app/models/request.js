import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { empty, equal, gt, uniqBy } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';

export const PULL_REQUEST_MERGEABLE = {
  DRAFT: 'draft',
  CLEAN: 'clean'
};

const DEFAULT_MERGE_MODE = 'deep_merge_append';

const SOURCES = {
  API: 'api'
};

export default Model.extend({
  created_at: attr(),
  event_type: attr(),
  result: attr(),
  message: attr('string'),
  headCommit: attr(),
  baseCommit: attr(),
  branchName: attr('string'),
  pullRequestMergeable: attr('string'),
  tagName: attr('string'),
  pullRequest: attr('boolean'),
  pullRequestTitle: attr('string'),
  pullRequestNumber: attr('number'),
  config: attr(),
  rawConfigs: attr(),
  uniqRawConfigs: uniqBy('rawConfigs', 'source'),
  noConfigs: empty('rawConfigs'),
  repo: belongsTo('repo', { async: true }),
  commit: belongsTo('commit', { async: true }),
  messages: attr(),
  state: attr(),
  mergeMode: attr(),
  configs: attr(),

  // API models this as hasMany but serializers:request#normalize overrides it
  build: belongsTo('build', { async: true }),

  api: service(),

  isAccepted: computed('result', 'build.id', function () {
    // For some reason some of the requests have a null result beside the fact that
    // the build was created. We need to look into it, but for now we can just assume
    // that if build was created, the request was accepted

    let result = this.result;
    let buildId = this.get('build.id');

    return result === 'approved' || buildId;
  }),

  isPullRequest: computed('event_type', function () {
    let eventType = this.event_type;
    return eventType === 'pull_request';
  }),

  isDraft: equal('pullRequestMergeable', PULL_REQUEST_MERGEABLE.DRAFT),

  hasMessages: gt('messages.length', 0),

  apiConfigs: computed('uniqRawConfigs', function () {
    let configs = this.get('uniqRawConfigs') || [];
    configs = configs.filter(this.isApiConfig);
    configs = isEmpty(configs) ? [{}] : configs;
    return configs.map((config) => {
      config.mergeMode = config.mergeMode || DEFAULT_MERGE_MODE;
      return config;
    });
  }),

  isApiConfig(config) {
    return config.source.toString().startsWith(SOURCES.API);
  }
});
