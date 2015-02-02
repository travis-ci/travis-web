BasicView = Travis.BasicView

View = BasicView.extend
  templateName: 'profile/tabs'
  tabBinding: 'controller.tab'

  activate: ->
    @get('controller').activate(event.target.name)

  classHooks: (->
    'active' if @get('tab') == 'hooks'
  ).property('tab')

  classUser: (->
    'active' if @get('tab') == 'user'
  ).property('tab')

  displayUser: (->
    @get('controller.account.login') == @get('controller.user.login')
  ).property('controller.account.login', 'controller.user.login')

ProfileTabsView = View
