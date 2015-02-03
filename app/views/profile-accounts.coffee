BasicView = Travis.BasicView

View = BasicView.extend
  tabBinding: 'controller.tab'
  templateName: 'profile/accounts'
  classAccounts: (->
    'active' if @get('tab') == 'accounts'
  ).property('tab')


ProfileAccountsView = View
