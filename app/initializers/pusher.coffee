`import config from 'travis/config/environment'`
`import TravisPusher from 'travis/utils/pusher'`

initialize = (container, application) ->
  if config.pusher.key
    application.pusher = new TravisPusher(config.pusher)

    application.register 'pusher:main', application.pusher, { instantiate: false }

    application.inject('route', 'pusher', 'pusher:main')

    application.pusher.store = container.lookup('store:main')


PusherInitializer =
  name: 'pusher'
  after: 'ember-data'
  initialize: initialize

`export {initialize}`
`export default PusherInitializer`
