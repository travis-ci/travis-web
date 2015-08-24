`import config from 'travis/config/environment'`
`import TravisPusher from 'travis/utils/pusher'`

initialize = (data) ->
  application = data.application

  if config.pusher.key
    application.pusher = new TravisPusher(config.pusher)

    application.register 'pusher:main', application.pusher, { instantiate: false }

    application.inject('route', 'pusher', 'pusher:main')

    application.pusher.store = data.container.lookup('service:store')

PusherInitializer =
  name: 'pusher'
  after: 'ember-data'
  initialize: initialize

`export {initialize}`
`export default PusherInitializer`
