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

  billingUrl: (->
    id = if @get('account.type') == 'user' then 'user' else @get('account.login')
    "#{@get('config').billingEndpoint}/subscriptions/#{id}"
  ).property('account.login', 'account.type')

`export default Controller`
