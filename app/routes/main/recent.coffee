`import TravisRoute from 'travis/routes/basic'`
`import MainTabRoute from 'travis/routes/main-tab'`

Route = MainTabRoute.extend
  reposTabName: 'recent'

  activate: ->
    @store.set('isRecentTabOpen', true)

  deactivate: ->
    @store.set('isRecentTabOpen', false)

`export default Route`
