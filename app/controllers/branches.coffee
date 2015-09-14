`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import GithubUrlPropertievs from 'travis/mixins/github-url-properties'`

BranchesController = Ember.Controller.extend

  defaultBranch: (->
    repos = @get('model')
    console.log(repos[0])
    repos[0]
  ).property('model')

  activeBranches: (->
    repos = @get('model')
    repos = repos.filter (item, index) ->
      item if item.exists_on_github == true
    .sort (a, b) ->
      return 0

  ).property('model')

  inactiveBranches: (->
    repos = @get('model')
    repos = repos.filter (item, index) ->
      item if item.exists_on_github == false
  ).property('model')

`export default BranchesController`
