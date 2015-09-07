initialize = (data) ->
  data.application.pusher.store = data.container.lookup('service:store')

PusherInitializer =
  name: 'pusher'
  after: 'ember-data'
  initialize: initialize

`export {initialize}`
`export default PusherInitializer`
