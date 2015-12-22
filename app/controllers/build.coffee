`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import GithubUrlPropertievs from 'travis/mixins/github-url-properties'`

Controller = Ember.Controller.extend GithubUrlPropertievs,
  repoController: Ember.inject.controller('repo')
  repoBinding: 'repoController.repo'
  commitBinding: 'build.commit'
  currentUserBinding: 'auth.currentUser'
  tabBinding: 'repoController.tab'
  sendFaviconStateChanges: true

  currentItemBinding: 'build'

  jobsLoaded: (->
    if jobs = @get('build.jobs')
      jobs.isEvery('config')
  ).property('build.jobs.@each.config')

  loading: (->
    @get('build.isLoading')
  ).property('build.isLoading')

  buildStateDidChange: (->
    if @get('sendFaviconStateChanges')
      @send('faviconStateDidChange', @get('build.state'))
  ).observes('build.state')

`export default Controller`
