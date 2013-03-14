Travis.LineNumberParser = Ember.Mixin.create
  fetchLineNumber: ->
    match[1] if match = document.location.hash.match(/#L(\d+)$/)
