require 'travis/model'

@Travis.Artifact = Travis.Model.extend
  body: DS.attr('string')
  init: ->
    @_super.apply this, arguments
    @set 'queue', Ember.A([])

  append: (body) ->
    if @get('isLoaded')
      @set('body', @get('body') + body)
    else
      @get('queue').pushObject(body)

  recordDidLoad: (->
    if @get('isLoaded')
      queue = @get('queue')
      if queue.get('length') > 0
        @append queue.toArray().join('')
  ).observes('isLoaded')
