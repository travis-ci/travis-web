require 'travis/model'

@Travis.Event = Travis.Model.extend
  event:     DS.attr('string')
  repoId:    DS.attr('number', key: 'repository_id')
  createdAt: DS.attr('string', key: 'created_at')

  message: (->
    message = "#{@get('event')}: #{@get('_data.result')}"
    message = "#{message}: #{@get('_data.message')}"
    message
  ).property('_data.result', '_data.message')

  _data: (->
    @get('data.data')
  ).property('data.data')

@Travis.Event.reopenClass
  byRepoId: (id) ->
    @find repository_id: id
