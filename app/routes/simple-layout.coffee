`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  setupController: ->
    $('body').attr('id', 'simple')
    @container.lookup('controller:repos').activate('owned')
    @_super.apply(this, arguments)

  renderTemplate: ->
    @_super.apply(this, arguments)

`export default Route`
