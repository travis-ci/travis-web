`import Ember from 'ember'`
`import Model from 'travis/models/model'`

Request = Model.extend
  created_at:        DS.attr()
  event_type:        DS.attr()
  result:            DS.attr()
  message:           DS.attr()
  headCommit:        DS.attr()
  baseCommit:        DS.attr()
  branchName:        DS.attr()
  tagName:           DS.attr()
  pullRequest:       DS.attr('boolean')
  pullRequestTitle:  DS.attr()
  pullRequestNumber: DS.attr('number')

  repo:   DS.belongsTo('repo')
  commit: DS.belongsTo('commit')
  build:  DS.belongsTo('build')

  isAccepted: (->
    # For some reason some of the requests have a null result beside the fact that
    # the build was created. We need to look into it, but for now we can just assume
    # that if build was created, the request was accepted
    @get('result') == 'accepted' || @get('build')
  ).property('result')

  isPullRequest: (->
    @get('event_type') == 'pull_request'
  ).property('event_type')

`export default Request`
