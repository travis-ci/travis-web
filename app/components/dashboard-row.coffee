`import Ember from 'ember'`
`import { githubCommit as githubCommitUrl } from 'travis/utils/urls'`
`import config from 'travis/config/environment'`

DashboardRowComponent = Ember.Component.extend

  tagName: 'li'
  classNameBindings: ['repo.default_branch.last_build.state']
  classNames: ['dashboard-row', 'row-li']
  isLoading: false
  isTriggering: false
  hasTriggered: false

  urlGithubCommit: (->
    githubCommitUrl(@get('repo.slug'), @get('repo.default_branch.last_build.commit.sha'))
  ).property('repo')

  # canTrigger: (->
  #   if !@get('auth.signedIn')
  #     false
  #   else
  #     permissions = @get('auth.currentUser.permissions')
  #     if permissions.contains parseInt(@get('build.repository.id'))
  #       true
  #     else
  #       false
  # ).property()

  # triggerBuild: (->
  #   apiEndpoint = config.apiEndpoint
  #   repoId = @get('build.repository.id')
  #   options = {
  #     type: 'POST',
  #     body: {
  #       request: {
  #         branch: @get('build.name')
  #       }
  #     }
  #   }
  #   if @get('auth.signedIn')
  #     options.headers = { Authorization: "token #{@auth.token()}" }
  #   $.ajax("#{apiEndpoint}/v3/repo/#{repoId}/requests", options).then (response) =>
  #     @set('isTriggering', false)
  #     @set('hasTriggered', true)
  # )

  actions:
    tiggerBuild: (branch) ->
      @set('isTriggering', true)
      @triggerBuild()

    # viewAllBuilds: (branch) ->
    #   @get('routing').transitionTo('builds')

`export default DashboardRowComponent`
