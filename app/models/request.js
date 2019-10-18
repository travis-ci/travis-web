import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { empty, uniqBy, equal } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { Promise as EmberPromise } from 'rsvp';

const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

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
  raw_configs: attr(),
  uniqRawConfigs: uniqBy('raw_configs', 'source'),
  noYaml: empty('raw_configs'),
  repo: belongsTo('repo', { async: true }),
  commit: belongsTo('commit', { async: true }),

  // API models this as hasMany but serializers:request#normalize overrides it
  build: belongsTo('build', { async: true }),

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

  ajax: service(),

  messagesRequest: computed('repo.id', 'build.request.id', function () {
    let repoId = this.get('repo.id');
    let requestId = this.get('build.request.id');
    if (repoId && requestId) {
      return ObjectPromiseProxy.create({
        promise: this.ajax.ajax(`/repo/${repoId}/request/${requestId}/messages`, 'get', {
          headers: {
            'Travis-API-Version': '3'
          }})
          .then(response => ({messages: response.messages}))
      });
    }
  }),

  messages: computed('messagesRequest', function () {
    let response = this.get('messagesRequest');
    if (response) {
      return response.get('messages');
    } else {
      return ObjectPromiseProxy.create({
        promise: EmberPromise.resolve([])
      });
    }
  }),

  hasMessages: computed('messagesRequest', function () {
    return this.get('messagesRequest').get('messages') != undefined;
  }),
});
