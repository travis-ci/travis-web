`import config from 'travis/config/environment'`

initialize = (container, application) ->
  application.register 'config:main', config, { instantiate: false }

  application.inject('controller', 'config', 'config:main')
  application.inject('route', 'config', 'config:main')

ConfigInitializer =
  name: 'config'
  initialize: initialize

`export {initialize}`
`export default ConfigInitializer`
