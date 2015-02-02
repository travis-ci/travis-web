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
    if view = Ember.View.currentPopupView
      view.destroy()
      Ember.View.currentPopupView = null

    $('.popup').removeClass('display')

Travis.BasicView = View
