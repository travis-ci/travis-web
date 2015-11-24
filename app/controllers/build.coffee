`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import GithubUrlPropertievs from 'travis/mixins/github-url-properties'`

Controller = Ember.Controller.extend GithubUrlPropertievs,
  needs: ['repo', 'currentUser']
  repoBinding: 'controllers.repo.repo'
  commitBinding: 'build.commit'
  currentUserBinding: 'controllers.currentUser.model'
  tabBinding: 'controllers.repo.tab'
  sendFaviconStateChanges: true

  currentItemBinding: 'build'

  jobsLoaded: (->
    if jobs = @get('build.jobs')
      jobs.everyBy('config')
  ).property('build.jobs.@each.config')

  loading: (->
    @get('build.isLoading')
  ).property('build.isLoading')

  buildStateDidChange: (->
    if @get('sendFaviconStateChanges')
      @send('faviconStateDidChange', @get('build.state'))
  ).observes('build.state')

`export default Controller`
