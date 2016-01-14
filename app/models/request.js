import Ember from 'ember';
import Model from 'travis/models/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

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

  isAccepted: function() {
    // For some reason some of the requests have a null result beside the fact that
    // the build was created. We need to look into it, but for now we can just assume
    // that if build was created, the request was accepted
    return this.get('result') === 'accepted' || this.get('build.id');
  }.property('result'),

  isPullRequest: function() {
    return this.get('event_type') === 'pull_request';
  }.property('event_type')
});
