`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import { githubCommit as githubCommitUrl } from 'travis/utils/urls'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

BranchRowComponent = Ember.Component.extend

  tagName: 'li'
  classNameBindings: ['build.last_build.state']
  classNames: ['branch-row']
  isLoading: false
  isTriggering: false
  hasTriggered: false

  urlGithubCommit: (->
    githubCommitUrl(@get('build.repository.slug'), @get('build.last_build.commit.sha'))
  ).property('build.last_build')

  getLast5Builds: (->

    lastBuilds = Ember.ArrayProxy.create(
      content: [{}, {}, {}, {}, {}]
      isLoading: true,
      count: 0
    )

    if !@get('build.last_build')
      lastBuilds.set('isLoading', false)
    else
      apiEndpoint = config.apiEndpoint
      repoId = @get('build.repository.id')
      branchName = @get('build.name')

      options = {}
      if @get('auth.signedIn')
        options.headers = { Authorization: "token #{@auth.token()}" }

      $.ajax("#{apiEndpoint}/v3/repo/#{repoId}/builds?branch.name=#{branchName}&limit=5", options).then (response) ->
        array = response.builds.map( (build) ->
          Ember.Object.create(build)
        )
        if array.length < 5
          for i in [1..5 - array.length] by 1
            array.push({})

        lastBuilds.set('count', response['@pagination'].count)
        lastBuilds.set('content', array)
        lastBuilds.set('isLoading', false)

    lastBuilds
  ).property()

  canTrigger: (->
    @get('auth.signedIn')
  ).property()

  triggerBuild: (->
    apiEndpoint = config.apiEndpoint
    repoId = @get('build.repository.id')
    options = {
      type: 'POST',
      body: {
        request: {
          branch: @get('build.name')
        }
      }
    }
    if @get('auth.signedIn')
      options.headers = { Authorization: "token #{@auth.token()}" }
    $.ajax("#{apiEndpoint}/v3/repo/#{repoId}/requests", options).then (response) =>
      @.set('isTriggering', false)
      @.set('hasTriggered', true)
  )

  actions:
    tiggerBuild: (branch) ->
      @.set('isTriggering', true)
      @triggerBuild()

    viewAllBuilds: (branch) ->
      console.log('view all builds')

`export default BranchRowComponent`
