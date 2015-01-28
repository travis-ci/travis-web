require 'travis/model'

Model = Travis.Model

Event = Model.extend
  event:        DS.attr()
  repositoryId: DS.attr('number')
  sourceId:     DS.attr('number')
  sourceType:   DS.attr()
  createdAt:    DS.attr()

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

Travis.Event = Event
