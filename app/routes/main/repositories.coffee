`import MainTabRoute from 'travis/routes/main-tab'`

Route = MainTabRoute.extend
  needsAuth: true
  reposTabName: 'owned'
  afterModel: ->
    @controllerFor('repos').possiblyRedirectToGettingStartedPage()

`export default Route`
