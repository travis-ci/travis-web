require 'travis/model'

@Travis.Request = Travis.Model.extend
  id:                Ember.attr('string')
  created_at:        Ember.attr('string')
  event_type:        Ember.attr('string')
  result:            Ember.attr('string')
  message:           Ember.attr('string')
  headCommit:        Ember.attr('string')
  baseCommit:        Ember.attr('string')
  branchName:        Ember.attr('string', key: 'branch')
  tagName:           Ember.attr('string', key: 'tag')
  pullRequest:       Ember.attr('boolean')
  pullRequestTitle:  Ember.attr('string')
  pullRequestNumber: Ember.attr(Number)

  repo:   Ember.belongsTo('Travis.Repo', key: 'repository_id')
  commit: Ember.belongsTo('Travis.Commit', key: 'commit_id')
  build:  Ember.belongsTo('Travis.Build', key: 'build_id')

  isAccepted: (->
    # For some reason some of the requests have a null result beside the fact that
    # the build was created. We need to look into it, but for now we can just assume
    # that if build was created, the request was accepted
    @get('result') == 'accepted' || @get('build')
  ).property('result')

  isPullRequest: (->
    @get('event_type') == 'pull_request'
  ).property('event_type')
