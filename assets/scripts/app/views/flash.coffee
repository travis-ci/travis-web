@Travis.reopen
  FlashView: Travis.BasicView.extend
    classNames: ['flash']
    tagName: 'ul'
    templateName: 'layouts/flash'

  FlashItemView: Travis.BasicView.extend
    tagName: 'li'
    classNameBindings: ['type']

    type: (->
      @get('flash.type') || 'broadcast'
    ).property('flash.type')

    actions:
      close: ->
        @get('controller').close(@get('flash'))
