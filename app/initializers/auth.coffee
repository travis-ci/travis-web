`import Auth from 'travis/utils/auth'`

initialize = (container, app) ->
  app.register 'auth:main', Auth

  app.inject('route', 'auth', 'auth:main')
  app.inject('controller', 'auth', 'auth:main')
  app.inject('application', 'auth', 'auth:main')

  app.inject('auth', 'store', 'store:main')

AuthInitializer =
  name: 'auth'
  initialize: initialize

`export {initialize}`
`export default AuthInitializer`
