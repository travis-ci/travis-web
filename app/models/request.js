import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';

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
  repo: belongsTo('repo', { async: true }),
  commit: belongsTo('commit', { async: true }),
  build: belongsTo('build', { async: true }),

  @computed('result', 'build.id')
  isAccepted(result, buildId) {
    // For some reason some of the requests have a null result beside the fact that
    // the build was created. We need to look into it, but for now we can just assume
    // that if build was created, the request was accepted
    return result === 'accepted' || buildId;
  },

  @computed('event_type')
  isPullRequest(eventType) {
    return eventType === 'pull_request';
  },
});
