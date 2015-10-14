`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import GithubUrlPropertievs from 'travis/mixins/github-url-properties'`

BranchesController = Ember.Controller.extend

  defaultBranch: (->
    repos = @get('model')
    output = repos.filter (item, index) ->
      item if item.default_branch == true
    if output.length
      output[0]
  ).property('model')

  activeBranches: (->
    repos = @get('model')
    repos = repos.filter (item, index) ->
      item if item.exists_on_github == true && item.default_branch == false
    .sortBy('default_branch.last_build.finished_at')
    .reverse()
  ).property('model')

  inactiveBranches: (->
    repos = @get('model')
    repos = repos.filter (item, index) ->
      item if item.exists_on_github == false
    .sortBy('last_build.finished_at')
    .reverse()
  ).property('model')

`export default BranchesController`
