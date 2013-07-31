require 'travis/model'

@Travis.Branch = Travis.Model.extend
  repoId:       Ember.attr('number', key: 'repository_id')
  commitId:     Ember.attr('number')
  state:        Ember.attr('string')
  number:       Ember.attr('number')
  branch:       Ember.attr('string')
  message:      Ember.attr('string')
  result:       Ember.attr('number')
  duration:     Ember.attr('number')
  startedAt:    Ember.attr('string')
  finishedAt:   Ember.attr('string')

  commit: Ember.belongsTo('Travis.Commit')

  repo: (->
    Travis.Repo.find @get('repoId')  if @get('repoId')
  ).property('repoId')

  updateTimes: ->
    @notifyPropertyChange 'started_at'
    @notifyPropertyChange 'finished_at'

@Travis.Branch.reopenClass
  byRepoId: (id) ->
    @find repository_id: id
