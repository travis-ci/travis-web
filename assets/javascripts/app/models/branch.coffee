require 'travis/model'

@Travis.Branch = Travis.Model.extend Travis.Helpers,
  repositoryId: DS.attr('number')
  commitId:     DS.attr('number')
  number:       DS.attr('number')
  branch:       DS.attr('string')
  message:      DS.attr('string')
  result:       DS.attr('number')
  duration:     DS.attr('number')
  startedAt:    DS.attr('string')
  finishedAt:   DS.attr('string')

  commit: DS.belongsTo('Travis.Commit')

  repository: (->
    Travis.Repository.find @get('repositoryId')  if @get('repositoryId')
  ).property('repositoryId')

  updateTimes: ->
    @notifyPropertyChange 'started_at'
    @notifyPropertyChange 'finished_at'


@Travis.Branch.reopenClass
  byRepositoryId: (id) ->
    @find repository_id: id

