import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias, empty } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
import { Promise as EmberPromise } from 'rsvp';

export default Model.extend({
  created_at: attr(),
  event_type: attr(),
  result: attr(),
  message: attr(),
  headCommit: attr(),
  baseCommit: attr(),
  branchName: attr(),
  tagName: attr(),
  pullRequest: attr('boolean'),
  pullRequestTitle: attr(),
  pullRequestNumber: attr('number'),
  raw_configs: attr(),
  noYaml: empty('raw_configs'),
  repo: belongsTo('repo', { async: true }),
  commit: belongsTo('commit', { async: true }),

  // API models this as hasMany but serializers:request#normalize overrides it
  build: belongsTo('build', { async: true }),

  isAccepted: computed('result', 'build.id', function () {
    // For some reason some of the requests have a null result beside the fact that
    // the build was created. We need to look into it, but for now we can just assume
    // that if build was created, the request was accepted

    let result = this.get('result');
    let buildId = this.get('build.id');

    return result === 'approved' || buildId;
  }),

  isPullRequest: computed('event_type', function () {
    let eventType = this.get('event_type');
    return eventType === 'pull_request';
  }),

  uniqRawConfigs: computed('raw_configs', function () {
    let rawConfigs = this.get('raw_configs');
    return rawConfigs.uniqBy('source');
  }),

  ajax: service(),

  messagesRequest: computed('repo.id', 'build.request.id', function () {
    let repoId = this.get('repo.id');
    let requestId = this.get('build.request.id');
    if (repoId && requestId) {
      return ObjectPromiseProxy.create({
        promise: this.get('ajax').ajax(`/repo/${repoId}/request/${requestId}/messages`, 'get', {
          headers: {
            'Travis-API-Version': '3'
          }})
          .then(response => ({messages: response.messages}))
      });
    } else {
      return ObjectPromiseProxy.create({
        promise: EmberPromise.resolve([])
      });
    }
  }),

  messages: alias('messagesRequest.messages'),
});
