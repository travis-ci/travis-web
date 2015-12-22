`import BasicView from 'travis/views/basic'`

View = BasicView.extend
  templateName: 'profile/show'
  layoutName: 'layouts/profile'
  classNames: ['profile-view']
  accountBinding: 'controller.account'
  # Can we remove these?
  # subscribedBinding: 'account.subscribed'
  # educationBinding: 'account.education'

  name: (->
    @get('account.name') || @get('account.login')
  ).property('account.name', 'account.login')

`export default View`
