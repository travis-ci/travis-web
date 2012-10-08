Travis.FlashController = Ember.ArrayController.extend
  init: ->
    @_super.apply this, arguments
    @set('content', Ember.A())



