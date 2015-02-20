`import TravisRoute from 'travis/routes/basic'`
`import MainTabRoute from 'travis/routes/main-tab'`

Route = MainTabRoute.extend
  reposTabName: 'recent'

  activate: ->
    @_super.apply(this, arguments)
    @store.set('isRecentTabOpen', true)

  deactivate: ->
    @_super.apply(this, arguments)
    @store.set('isRecentTabOpen', false)

`export default Route`
