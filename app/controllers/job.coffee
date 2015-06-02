`import Ember from 'ember'`
`import { githubCommit } from 'travis/utils/urls'`

Controller = Ember.Controller.extend
  needs: ['repo', 'currentUser']

  repoBinding: 'controllers.repo.repo'
  commitBinding: 'job.commit'
  annotationsBinding: 'job.annotations'
  currentUserBinding: 'controllers.currentUser.model'
  tabBinding: 'controllers.repo.tab'

  currentItemBinding: 'job'

  urlGithubCommit: (->
    githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')

  jobStateDidChange: (->
    @send('faviconStateDidChange', @get('job.state'))
  ).observes('job.state')

`export default Controller`
