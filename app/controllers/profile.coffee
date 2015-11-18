`import Ember from 'ember'`

Controller = Ember.Controller.extend
  name: 'profile'

  accountController: Ember.inject.controller('account')
  accountsController: Ember.inject.controller('accounts')
  userBinding: 'auth.currentUser'
  accountBinding: 'accountController.model'

  activate: (action, params) ->
    this["view_#{action}".camelize()]()

  viewHooks: ->
    @connectTab('hooks')
    @get('accountController').reloadHooks()

  viewUser: ->
    @connectTab('user')

  connectTab: (tab) ->
    @set('tab', tab)

`export default Controller`
