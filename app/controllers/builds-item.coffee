`import Ember from 'ember'`
`import { colorForState } from 'travis/utils/helpers'`
`import GithubUrlProperties from 'travis/mixins/github-url-properties'`

Controller = Ember.ObjectController.extend(GithubUrlProperties,
  needs: ['builds']
  isPullRequestsListBinding: 'controllers.builds.isPullRequestsList'
  buildBinding: 'content'

  color: (->
    colorForState(@get('build.state'))
  ).property('build.state')
)

`export default Controller`
