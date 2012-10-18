@Travis.reopen
  FlashView: Travis.View.extend
    elementId: 'flash'
    tagName: 'ul'
    templateName: 'layouts/flash'

  FlashItemView: Travis.View.extend
    tagName: 'li'
    classNameBindings: ['flash.type']

    close: (event) ->
      @get('controller').close(@get('flash'))
