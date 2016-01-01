`import Ember from 'ember'`
`import GithubUrlPropertievs from 'travis/mixins/github-url-properties'`

BranchesController = Ember.Controller.extend

  defaultBranch: (->
    repos = @get('model')
    output = repos.filter (item, index) ->
      item.default_branch
    if output.length
      output[0]
  ).property('model')

  activeBranches: (->
    repos = @get('model')
    console.log repos
    repos = repos.filter (item, index) ->
      item.exists_on_github && !item.default_branch
    .sortBy('last_build.finished_at')
    .reverse()
  ).property('model')

  inactiveBranches: (->
    repos = @get('model')
    repos = repos.filter (item, index) ->
      !item.exists_on_github && !item.default_branch
    .sortBy('last_build.finished_at')
    .reverse()
  ).property('model')

`export default BranchesController`
