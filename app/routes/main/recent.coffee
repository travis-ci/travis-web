`import TravisRoute from 'travis/routes/basic'`
`import MainTabRoute from 'travis/routes/main-tab'`

Route = MainTabRoute.extend
  reposTabName: 'recent'

  activate: ->
    @store.set('recentReposOpened', true)

`export default Route`
