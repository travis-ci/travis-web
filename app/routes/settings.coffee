`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  needsAuth: true
  setupController: (controller, model) ->
    @controllerFor('repo').activate('settings')

`export default Route`
