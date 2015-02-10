`import TravisLocation from 'travis/utils/location'`

initialize = (container, application) ->
  application.register 'location:travis', TravisLocation

Initializer =
  name: 'location'
  initialize: initialize

`export { initialize }`
`export default Initializer`
