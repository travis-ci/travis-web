@after = (time, func) ->
  waits(time)
  jasmine.getEnv().currentSpec.runs(func)

@once = (condition, func) ->
  waitsFor(condition)
  jasmine.getEnv().currentSpec.runs(func)

@waitFor = waitsFor

