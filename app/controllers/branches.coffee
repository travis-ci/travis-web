`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import GithubUrlPropertievs from 'travis/mixins/github-url-properties'`

BranchesController = Ember.Controller.extend

  actions:
    tiggerBuild: (branch) ->
      console.log('trigger build')

    viewAllBuilds: (branch) ->
      console.log('view all builds')
    # updateFilter: (value) ->
    #   @set('_lastFilterValue', value)
    #   Ember.run.throttle this, @updateFilter, [], 200, false

`export default BranchesController`
