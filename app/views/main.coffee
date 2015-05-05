`import Ember from 'ember'`

View = Ember.View.extend
  layoutName: 'layouts/home'
  classNames: ['main']

  sidebarVisible: (->
    @get('controller.auth.signedIn') && !@get('controller.ownersPage')
  ).property('controller.auth.signedIn', 'controller.ownersPage')

`export default View`
