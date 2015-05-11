`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  model: ->
    console.log('This is the RUNNING route')

`export default Route`
