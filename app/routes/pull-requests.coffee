`import AbstractBuildsRoute from 'travis/routes/abstract-builds'`

Route = AbstractBuildsRoute.extend(
  contentType: 'pull_requests'

  # TODO: it would be better to have separate controller for branches and PRs list
  setupController: (controller, model) ->
    @_super(controller, model)

    this.controllerFor('builds').set('isPullRequestsList', true)

  deactivate: ->
    this.controllerFor('builds').set('isPullRequestsList', false)
)

`export default Route`
