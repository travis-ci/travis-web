Travis.DurationCalculations = Ember.Mixin.create
  duration: (->
    if duration = @get('_duration')
      duration
    else
      Travis.Helpers.durationFrom(@get('startedAt'), @get('finishedAt'))
  ).property('_duration', 'finishedAt', 'startedAt')

  updateTimes: ->
    unless @get('isFinished')
      @notifyPropertyChange '_duration'
      @notifyPropertyChange 'finished_at'
