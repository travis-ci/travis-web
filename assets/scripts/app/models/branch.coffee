require 'travis/model'

@Travis.Branch = Travis.Model.extend Travis.Helpers,
  repoId:       DS.attr('number', key: 'repository_id')
  commitId:     DS.attr('number')
  state:        DS.attr('string')
  number:       DS.attr('number')
  branch:       DS.attr('string')
  message:      DS.attr('string')
  result:       DS.attr('number')
  duration:     DS.attr('number')
  startedAt:    DS.attr('string')
  finishedAt:   DS.attr('string')

  commit: DS.belongsTo('Travis.Commit')

  repo: (->
    Travis.Repo.find @get('repoId')  if @get('repoId')
  ).property('repoId')

  updateTimes: ->
    @notifyPropertyChange 'started_at'
    @notifyPropertyChange 'finished_at'

@Travis.Branch.reopenClass
  byRepoId: (id) ->
    @find repository_id: id
