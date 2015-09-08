`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import GithubUrlPropertievs from 'travis/mixins/github-url-properties'`

BranchesController = Ember.Controller.extend

  defaultBranch: (->
    repos = @get('model')

    # repos = repos.filter (item, index) ->
    #   item.get('owner.login') == org

  ).property('model')

  activeBranches: (->
    repos = @get('model')
  ).property('model')

  inactiveBranches: (->
    repos = @get('model')
  ).property('model')

  actions:
    tiggerBuild: (branch) ->
      console.log('trigger build')

    viewAllBuilds: (branch) ->
      console.log('view all builds')
    # updateFilter: (value) ->
    #   @set('_lastFilterValue', value)
    #   Ember.run.throttle this, @updateFilter, [], 200, false

`export default BranchesController`
