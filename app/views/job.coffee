`import Ember from 'ember'`
`import { colorForState } from 'travis/utils/helpers'`
`import { githubCommit, gravatarImage } from 'travis/utils/urls'`
`import Polling from 'travis/mixins/polling'`

View = Ember.View.extend Polling,
  pollModels: 'controller.job.build'

  repoBinding: 'controller.repo'
  jobBinding: 'controller.job'
  commitBinding: 'job.commit'

  currentItemBinding: 'job'

  color: (->
    colorForState(@get('job.state'))
  ).property('job.state')

  urlGithubCommit: (->
    githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')

  urlCommitterGravatarImage: (->
    gravatarImage(@get('commit.committerEmail'), 40)
  ).property('commit.committerEmail')

  urlAuthorGravatarImage: (->
    gravatarImage(@get('commit.authorEmail'), 40)
  ).property('commit.authorEmail')

`export default View`
