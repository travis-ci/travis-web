`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  setupController: ->
    $('body').attr('id', 'simple')
    toActivate = if @signedIn() then 'owned' else 'recent'
    @container.lookup('controller:repos').activate(toActivate)
    @_super.apply(this, arguments)

  renderTemplate: ->
    @_super.apply(this, arguments)

`export default Route`
