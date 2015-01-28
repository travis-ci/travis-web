colorForState = Travis.Helpers.colorForState

Controller = Em.ObjectController.extend(Travis.GithubUrlProperties,
  needs: ['builds']
  isPullRequestsListBinding: 'controllers.builds.isPullRequestsList'
  buildBinding: 'content'

  color: (->
    colorForState(@get('build.state'))
  ).property('build.state')
)

Travis.BuildsItemController = Controller
