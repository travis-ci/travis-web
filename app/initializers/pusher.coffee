`import config from 'travis/config/environment'`
`import TravisPusher from 'travis/utils/pusher'`

initialize = (registry, application) ->
  null

PusherInitializer =
  name: 'pusher'
  after: 'ember-data'
  initialize: initialize

`export {initialize}`
`export default PusherInitializer`
