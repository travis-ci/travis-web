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
      # if a.last_build && b.last_build

      #   if a.last_build.finished_at == null
      #     return 1
      #   else
      #     if a.last_build.finished_at > b.last_build.finished_at
      #       return -1
      #     else if a.last_build.finished_at < b.last_build.finished_at
      #       return 1
      #     else
      #       return 0
      # else
      #   return -1
  ).property('model')

  inactiveBranches: (->
    repos = @get('model')
    repos = repos.filter (item, index) ->
      item if item.exists_on_github == false
  ).property('model')

`export default BranchesController`
