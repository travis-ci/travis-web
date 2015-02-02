BasicView = Travis.BasicView

View = BasicView.extend
  tagName: 'li'
  classNameBindings: ['type']

  type: (->
    @get('flash.type') || 'broadcast'
  ).property('flash.type')

  actions:
    close: ->
      @get('controller').close(@get('flash'))

FlashItemView = View
