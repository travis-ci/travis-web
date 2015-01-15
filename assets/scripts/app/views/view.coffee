View = Ember.View.extend
    actions:
      popup: (name) -> @popup(name)
      popupClose: -> @popupClose()

    popup: (name) ->
      @popupCloseAll()
      name = event?.target?.name || name
      $("##{name}").toggleClass('display')
    popupClose: ->
      $('.popup').removeClass('display')
    popupCloseAll: ->
      if view = Travis.View.currentPopupView
        view.destroy()
        Travis.View.currentPopupView = null

      $('.popup').removeClass('display')

Travis.View = View
