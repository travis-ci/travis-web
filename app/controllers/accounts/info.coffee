`import Ember from 'ember'`

Controller = Ember.Controller.extend
  needs: ['currentUser', 'repos']
  userBinding: 'controllers.currentUser'

`export default Controller`
