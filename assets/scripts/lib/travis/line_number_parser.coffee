Travis.LineNumberParser = Ember.Mixin.create
  fetchLineNumber: ->
    url = @container.lookup('router:main').get('url')
    if match = url.match(/#L(\d+)$/)
      match[1]
