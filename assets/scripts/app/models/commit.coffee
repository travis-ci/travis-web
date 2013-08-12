require 'travis/model'

@Travis.Commit = Travis.Model.extend
  buildId:           DS.attr('number')
  sha:               DS.attr('string')
  branch:            DS.attr('string')
  message:           DS.attr('string')
  compareUrl:        DS.attr('string')
  authorName:        DS.attr('string')
  authorEmail:       DS.attr('string')
  committerName:     DS.attr('string')
  committerEmail:    DS.attr('string')
  pullRequestNumber: DS.attr('number')

  build: DS.belongsTo('Travis.Build')

  shortSha: (->
    @get('sha')[0...6]
  ).property('sha')

  isPullRequest: (->
    @get('eventType') == 'pull_request'
  ).property('eventType')
