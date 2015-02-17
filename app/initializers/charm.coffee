`import config from 'travis/config/environment'`

initialize = (container, app) ->
  if config.charmKey
    window.__CHARM =
      key: config.charmKey
      url: "https://charmscout.herokuapp.com/feedback"

    window.bootstrapCharm()
    # $('head').append $('<script src="https://charmscout.herokuapp.com/charmeur.js?v=2" async defer></script>')

Initializer =
  name: 'charm'
  initialize: initialize

`export {initialize}`
`export default Initializer`
