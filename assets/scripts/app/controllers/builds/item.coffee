colorForState = Travis.Helpers.colorForState
GithubUrlProperties = Travis.GithubUrlProperties

Controller = Ember.ObjectController.extend(GithubUrlProperties,
  needs: ['builds']
  isPullRequestsListBinding: 'controllers.builds.isPullRequestsList'
  buildBinding: 'content'

  color: (->
    colorForState(@get('build.state'))
  ).property('build.state')
)

Travis.BuildsItemController = Controller
