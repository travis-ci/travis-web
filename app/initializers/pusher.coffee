`import config from 'travis/config/environment'`

initialize = (container, application) ->
  if config.pusher.key
    application.pusher = new Pusher(config.pusher)

    application.register 'pusher:main', application.pusher, { instantiate: false }

    application.inject('route', 'pusher', 'pusher:main')

    application.pusher.store = container.lookup('store:main')


PusherInitializer =
  name: 'pusher'
  initialize: initialize

`export {initialize}`
`export default PusherInitializer`
