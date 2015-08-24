`import Tailing from 'travis/utils/tailing'`
`import ToTop from 'travis/utils/to-top'`
`import config from 'travis/config/environment'`

initialize = (container, application) ->
  application.tailing = new Tailing($(window), '#tail', '#log')
  application.toTop   = new ToTop($(window), '.to-top', '#log-container')

Initializer =
  name: 'services'
  initialize: initialize

`export {initialize}`
`export default Initializer`
