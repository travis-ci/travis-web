require 'travis/model'

@Travis.Event = Travis.Model.extend
  event:     Ember.attr('string')
  repoId:    Ember.attr('number', key: 'repository_id')
  sourceId:  Ember.attr('number', key: 'source_id')
  sourceType:  Ember.attr('string', key: 'source_type')
  createdAt: Ember.attr('string', key: 'created_at')

  event_: (->
    @get('event')
  ).property('event')

  state: (->
    @get('data.data.state')
  ).property('data.data.state')

  message: (->
    @get('data.data.message')
  ).property('data.data.message')

  source: (->
    Travis[type].find(@get('sourceId')) if type = @get('sourceType')
  ).property('sourceType', 'sourceId')

@Travis.Event.reopenClass
  byRepoId: (id) ->
    @find repository_id: id
