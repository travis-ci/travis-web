`import Ember from 'ember'`
`import { colorForState } from 'travis/utils/helpers'`
`import GithubUrlProperties from 'travis/mixins/github-url-properties'`
`import { gravatarImage } from 'travis/utils/urls'`

Controller = Ember.ObjectController.extend(GithubUrlProperties,
  needs: ['builds']
  isPullRequestsListBinding: 'controllers.builds.isPullRequestsList'
  buildBinding: 'content'

  color: (->
    colorForState(@get('build.state'))
  ).property('build.state')

  urlAuthorGravatarImage: (->
    gravatarImage(@get('commit.authorEmail'), 40)
  ).property('commit.authorEmail')
)

`export default Controller`
