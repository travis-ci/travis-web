`import TravisRoute from 'travis/routes/basic'`
`import MainTabRoute from 'travis/routes/main-tab'`

Route = MainTabRoute.extend
  reposTabName: 'recent'

  activate: ->
    @store.set('recentReposTabIsOpened', true)

  deactivate: ->
    @store.set('recentReposTabIsOpened', true)

`export default Route`
