`import config from 'travis/config/environment'`

initialize = (container) ->


  userlikeData = {}

UserlikeInitializer =
  name: 'userlike'
  initialize: initialize

`export {initialize}`
`export default UserlikeInitializer`
