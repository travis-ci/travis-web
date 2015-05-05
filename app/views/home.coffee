`import BasicView from 'travis/views/basic'`

View = BasicView.extend
  layoutName: 'layouts/landing-page'

  sidebarVisible: (->
    @get('auth.signedIn') && !@get('controller.ownersPage')
  ).property('auth.signedIn', 'controller.ownersPage')

`export default View`
