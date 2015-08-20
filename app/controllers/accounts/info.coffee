`import Ember from 'ember'`

Controller = Ember.Controller.extend
  repos: Ember.inject.controller()
  userBinding: 'auth.currentUser'

`export default Controller`
