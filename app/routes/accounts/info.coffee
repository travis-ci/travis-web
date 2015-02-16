`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  setupController: ->
    user = @controllerFor('currentUser').get('model')
    @controllerFor('account').set('model', user)
    @controllerFor('profile').activate 'user'

  renderTemplate: ->
    @render 'accounts_info'

`export default Route`
