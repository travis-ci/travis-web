`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  renderTemplate: ->
    $('body').attr('id', 'not-found')

    @render 'not_found'

`export default Route`
