`import BasicRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = BasicRoute.extend
  needsAuth: false
  redirect: ->
    unless config.pro
      @transitionTo('/')

`export default Route`
