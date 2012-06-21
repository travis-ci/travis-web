@Travis.Ticker = Ember.Object.extend
  init: ->
    @_super()
    @schedule()
  tick: ->
    context = @get('context')
    @get('targets').forEach (target) =>
      target = context.get(target)
      return unless target
      if target.forEach
        target.forEach (target) -> target.tick()
      else
        target.tick()
    @schedule()
  schedule: ->
    Ember.run.later((=> @tick()), Travis.app.TICK_INTERVAL)


