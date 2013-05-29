@Travis.Ticker = Ember.Object.extend
  init: ->
    @schedule() unless @get('interval') == -1

  tick: ->
    context = @get('context')
    targets = @get('targets') || [@get('target')]
    for target in targets
      target = context.get(target) if context
      target.tick() if target
    @schedule()

  schedule: ->
    setTimeout((=> @tick()), @get('interval') || Travis.TICK_INTERVAL)
