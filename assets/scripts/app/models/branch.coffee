require 'models/model'

Model = Travis.Model

Branch = Model.extend
  repositoryId: DS.attr('number')
  commitId:     DS.attr('number')
  state:        DS.attr()
  number:       DS.attr('number')
  branch:       DS.attr()
  message:      DS.attr()
  result:       DS.attr('number')
  duration:     DS.attr('number')
  startedAt:    DS.attr()
  finishedAt:   DS.attr()

  commit: DS.belongsTo('commit')

  repo: (->
    @store.find('repo', @get('repositoryId')) if @get('repositoryId')
  ).property('repositoryId')

  updateTimes: ->
    @notifyPropertyChange 'started_at'
    @notifyPropertyChange 'finished_at'

Travis.Branch = Branch
