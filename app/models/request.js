import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import {
  empty,
  equal,
  gt,
  uniqBy
} from '@ember/object/computed';
import { task } from 'ember-concurrency';

export const PULL_REQUEST_MERGEABLE = {
  DRAFT: 'draft',
  CLEAN: 'clean'
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
  raw_configs: attr(),
  uniqRawConfigs: uniqBy('raw_configs', 'source'),
  noYaml: empty('raw_configs'),
  repo: belongsTo('repo', { async: true , inverse: null}),
  commit: belongsTo('commit', { async: true, inverse: null }),

  // API models this as hasMany but serializers:request#normalize overrides it
  build: belongsTo('build', { async: false, inverse: 'request' }),

  api: service(),
  tasks: service(),

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

  messages: computed('repo.id', 'build.request.id', 'fetchMessages.lastSuccessful.value', function () {
    const messages =  this.fetchMessages.lastSuccessful ? this.fetchMessages.lastSuccessful.value : [];
    console.log("MSG PERFORM");
    if (!messages) {
      this.fetchMessages.perform();
    }
    console.log(messages);
    return messages || [];
  }),

  fetchMessages: task(function* () {
    console.log("FETCH MSG");
    const repoId = this.get('repo.id');
    const requestId = this.get('build.request.id');
    console.log(`FETCH MSG ${repoId} ${requestId}`);
    if (repoId && requestId) {
      console.log(this.api);
      const response = yield this.api.get(`/repo/${repoId}/request/${requestId}/messages`) || {};
      console.log("RESP");
      console.log(response);
      console.log(response.messages);
      return response.messages;
    }
  }).drop(),

  hasMessages: gt('messages.length', 0),
});
