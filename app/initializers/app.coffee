initialize = (container, app) ->
  if typeof window != 'undefined'
    window.Travis = app

Initializer =
  name: 'app'
  initialize: initialize

`export {initialize}`
`export default Initializer`
