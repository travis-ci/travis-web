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

      $.ajax("#{apiEndpoint}/v3/repo/#{repoId}/builds?branch.name=#{branchName}&limit=5&offset=1", options).then (response) ->
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

  actions:
    tiggerBuild: (branch) ->
      console.log('trigger build')

    viewAllBuilds: (branch) ->
      console.log('view all builds')
    # updateFilter: (value) ->
    #   @set('_lastFilterValue', value)
    #   Ember.run.throttle this, @updateFilter, [], 200, false

`export default BranchRowComponent`
