`import Ember from 'ember'`
`import { githubCommit } from 'travis/utils/urls'`

Controller = Ember.Controller.extend
  repoController: Ember.inject.controller('repo')

  repoBinding: 'repoController.repo'
  commitBinding: 'job.commit'
  annotationsBinding: 'job.annotations'
  currentUserBinding: 'auth.currentUser'
  tabBinding: 'repoController.tab'

  currentItemBinding: 'job'

  urlGithubCommit: (->
    githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')

  jobStateDidChange: (->
    @send('faviconStateDidChange', @get('job.state'))
  ).observes('job.state')

`export default Controller`
