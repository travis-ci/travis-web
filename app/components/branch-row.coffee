`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import { githubCommit as githubCommitUrl } from 'travis/utils/urls'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

BranchRowComponent = Ember.Component.extend

  tagName: 'li'
  classNameBindings: ['build.state']
  classNames: ['branch-row']
  isLoading: true

  urlAuthorGravatarImage: (->
    gravatarImage(@get('build.commit.authorEmail'), 15)
  ).property('build.commit.authorEmail')

  urlGithubCommit: (->
    githubCommitUrl(@get('build.repo.slug'), @get('build.commit.sha'))
  ).property('build.commit.sha')

  getLast5Builds: (->

    # apiEndpoint = config.apiEndpoint
    # repoId = @get('build.repository.id')

    # options = {}
    # if @get('auth.signedIn')
    #   options.headers = { Authorization: "token #{@auth.token()}" }

    # $.ajax("#{apiEndpoint}/v3/repo/269284/builds?branch.name=master&limit=5", options).then (response) ->
    #   console.log(response)
    #   @set('isLoading', false)
  ).property('build')

`export default BranchRowComponent`
