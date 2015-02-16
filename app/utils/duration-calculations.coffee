`import Ember from 'ember'`
`import { durationFrom } from 'travis/utils/helpers'`

mixin = Ember.Mixin.create
  duration: (->
    if @get('notStarted')
      null
    else if duration = @get('_duration')
      duration
    else
      durationFrom(@get('startedAt'), @get('finishedAt'))
  ).property('_duration', 'finishedAt', 'startedAt', 'notStarted', '_finishedAt', '_startedAt')

  updateTimes: ->
    unless @get('isFinished')
      @notifyPropertyChange '_duration'
      @notifyPropertyChange 'finished_at'

`export default mixin`
