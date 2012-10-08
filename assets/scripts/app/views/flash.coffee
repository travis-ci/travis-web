@Travis.reopen
  FlashView: Travis.View.extend
    elementId: 'flash'
    templateName: 'layouts/flash'

    flashBinding: 'controller.firstObject'
    classNameBindings: ['flash.type']
    messageBinding: 'flash.message'

    close: (event) ->
      @get('controller').shiftObject()
