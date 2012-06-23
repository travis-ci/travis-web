require 'travis/model'

@Travis.Commit = Travis.Model.extend
  sha:            DS.attr('string')
  branch:         DS.attr('string')
  message:        DS.attr('string')
  compareUrl:     DS.attr('string')
  authorName:     DS.attr('string')
  authorEmail:    DS.attr('string')
  committerName:  DS.attr('string')
  committerEmail: DS.attr('string')

  build: DS.belongsTo('Travis.Build')
