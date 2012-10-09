@Travis.reopen
  FlashView: Travis.View.extend
    elementId: 'flash'
    tagName: 'ul'
    templateName: 'layouts/flash'

  FlashItemView: Travis.View.extend
    tagName: 'li'
    classNameBindings: ['type']

    type: (->
      @get('flash') && Ember.keys(@get('flash'))[0]
    ).property('flash')

    message: (->
      @get('flash') && @get('flash')[@get('type')]
    ).property('flash')

    close: (event) ->
      @get('controller').removeObject(@get('flash'))
