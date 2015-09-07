`import Auth from 'travis/utils/auth'`
`import TestAuth from 'travis/utils/test-auth'`

initialize = (container, app) ->
  app.register 'auth:main', if Ember.testing then TestAuth else Auth

  app.inject('route', 'auth', 'auth:main')
  app.inject('controller', 'auth', 'auth:main')
  app.inject('application', 'auth', 'auth:main')
  app.inject('component', 'auth', 'auth:main')

  app.inject('auth', 'store', 'service:store')

AuthInitializer =
  name: 'auth'
  after: 'ember-data'
  initialize: initialize

`export {initialize}`
`export default AuthInitializer`
