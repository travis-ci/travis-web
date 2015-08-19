`import Ember from 'ember'`

PopupService = Ember.Service.extend
  open: (name) ->
    @close()
    name = event?.target?.name || name
    $("##{name}").toggleClass('display')
  close: ->
    if view = Ember.View.currentPopupView
      view.destroy()
      Ember.View.currentPopupView = null

    $('.popup').removeClass('display')

`export default PopupService`
