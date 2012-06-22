require 'travis/model'

@Travis.Branch = Travis.Model.extend Travis.Helpers,
  repository_id: DS.attr('number')
  number:        DS.attr('number')
  branch:        DS.attr('string')
  message:       DS.attr('string')
  result:        DS.attr('number')
  duration:      DS.attr('number')
  started_at:    DS.attr('string')
  finished_at:   DS.attr('string')

  commit: DS.belongsTo('Travis.Commit')

  repository: (->
    Travis.Repository.find @get('repository_id')  if @get('repository_id')
  ).property('repository_id').cacheable()

  tick: ->
    @notifyPropertyChange 'started_at'
    @notifyPropertyChange 'finished_at'

@Travis.Branch.reopenClass
  byRepositoryId: (id) ->
    @find repository_id: id

