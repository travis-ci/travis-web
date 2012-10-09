Travis.FlashController = Ember.ArrayController.extend
  init: ->
    @_super.apply this, arguments
    @set('content', Ember.A())

  pushObjects: (objects) ->
    Ember.run.later(this, (-> @removeObjects(objects)), 10000)
    @_super(objects)
