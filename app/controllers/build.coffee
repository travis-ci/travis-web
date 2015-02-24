`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import GithubUrlPropertievs from 'travis/mixins/github-url-properties'`

Controller = Ember.Controller.extend GithubUrlPropertievs,
  needs: ['repo']
  repoBinding: 'controllers.repo.repo'
  commitBinding: 'build.commit'
  currentUserBinding: 'controllers.repo.currentUser'
  tabBinding: 'controllers.repo.tab'
  sendFaviconStateChanges: true

  currentItemBinding: 'build'

  loading: (->
    @get('build.isLoading')
  ).property('build.isLoading')

  urlCommitterGravatarImage: (->
    gravatarImage(@get('commit.committerEmail'), 40)
  ).property('commit.committerEmail')

  urlAuthorGravatarImage: (->
    gravatarImage(@get('commit.authorEmail'), 40)
  ).property('commit.authorEmail')

  buildStateDidChange: (->
    if @get('sendFaviconStateChanges')
      @send('faviconStateDidChange', @get('build.state'))
  ).observes('build.state')

`export default Controller`
