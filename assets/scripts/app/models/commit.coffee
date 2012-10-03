require 'travis/model'

@Travis.Commit = Travis.Model.extend
  buildId:        DS.attr('number')
  sha:            DS.attr('string')
  branch:         DS.attr('string')
  message:        DS.attr('string')
  compareUrl:     DS.attr('string')
  authorName:     DS.attr('string')
  authorEmail:    DS.attr('string')
  committerName:  DS.attr('string')
  committerEmail: DS.attr('string')

  build: DS.belongsTo('Travis.Build', key: 'buildId')
