`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import { githubCommit as githubCommitUrl } from 'travis/utils/urls'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

BranchRowComponent = Ember.Component.extend

  tagName: 'li'
  classNameBindings: ['build.last_build.state']
  classNames: ['branch-row']
  isLoading: true

  urlGithubCommit: (->
    githubCommitUrl(@get('build.repository.slug'), @get('build.last_build.commit.sha'))
  ).property('build.last_build')

  getLast5Builds: (->

    array = [{}, {}, {}, {}, {}]

    if @get('build.last_build') == null
      @set('isLoading', false)
      array
    else
      array

    # apiEndpoint = config.apiEndpoint
    # repoId = @get('build.repository.id')

    # options = {}
    # if @get('auth.signedIn')
    #   options.headers = { Authorization: "token #{@auth.token()}" }

    # $.ajax("#{apiEndpoint}/v3/repo/269284/builds?branch.name=master&limit=5", options).then (response) ->
    #   console.log(response)
    #   @set('isLoading', false)
  ).property('build')

  actions:
    tiggerBuild: (branch) ->
      console.log('trigger build')

    viewAllBuilds: (branch) ->
      console.log('view all builds')
    # updateFilter: (value) ->
    #   @set('_lastFilterValue', value)
    #   Ember.run.throttle this, @updateFilter, [], 200, false

`export default BranchRowComponent`
