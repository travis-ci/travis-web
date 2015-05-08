`import Ember from 'ember'`

Controller = Ember.Controller.extend
  name: 'profile'

  needs: ['currentUser', 'accounts', 'account']
  userBinding: 'controllers.currentUser.model'
  accountBinding: 'controllers.account.model'

  activate: (action, params) ->
    this["view_#{action}".camelize()]()

  viewHooks: ->
    @connectTab('hooks')
    @get('controllers.account').reloadHooks()

  viewUser: ->
    @connectTab('user')

  connectTab: (tab) ->
    @set('tab', tab)

  billingUrl: (->
    id = if @get('account.type') == 'user' then 'user' else @get('account.login')
    "#{@get('config').billingEndpoint}/subscriptions/#{id}"
  ).property('account.login', 'account.type')

`export default Controller`
