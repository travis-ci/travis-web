BasicView = Travis.BasicView

View = BasicView.extend
  templateName: 'profile/show'
  layoutName: 'layouts/profile'
  classNames: ['profile-view']
  accountBinding: 'controller.account'
  subscribedBinding: 'account.subscribed'
  educationBinding: 'account.education'

  name: (->
    @get('account.name') || @get('account.login')
  ).property('account.name', 'account.login')

ProfileView = View
