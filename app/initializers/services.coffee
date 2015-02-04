`import Slider from 'travis/utils/slider'`
`import Tailing from 'travis/utils/tailing'`
`import ToTop from 'travis/utils/to-top'`
`import config from 'travis/config/environment'`

initialize = (container, application) ->
  application.slider = new Slider(application.storage)
  application.tailing = new Tailing($(window), '#tail', '#log')
  application.toTop   = new ToTop($(window), '.to-top', '#log-container')

  application.register 'slider:main', application.slider, { instantiate: false }
  application.inject('view', 'slider', 'slider:main')

Initializer =
  name: 'services'
  initialize: initialize

`export {initialize}`
`export default Initializer`
