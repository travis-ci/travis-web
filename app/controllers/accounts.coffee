`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
  tab: 'accounts'

  userName: (->
    @get('user.name') || @get('user.login')
  ).property('user.login', 'user.name')


  actions: 
    tokenVisibility: () ->
      @toggleProperty('isVisible')
      return false

`export default Controller`
