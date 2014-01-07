Travis.LineNumberRegex = /#L(\d+)(-L(\d+))?$/
Travis.LineNumberParser = Ember.Mixin.create

  fetchLineNumbers: (hash) ->
    if match = hash.match(Travis.LineNumberRegex)
      start = match[1]
      end   = match[3]

      if end?
        [start, end]
      else
        [start]
    else
      []
