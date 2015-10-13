`import Ember from 'ember'`
`import config from 'travis/config/environment'`

Controller = Ember.Controller.extend
  queryParams: ['org']
  filter: null
  org: null

  filteredRepositories: (->
    filter = @get('filter')
    repos = @get('model')
    org = @get('org')
 
    repos = repos.filter (item, index) ->
      if item.get('default_branch')
        item.get('default_branch.last_build') != null
    .sortBy('default_branch.last_build.finished_at')
    .reverse()

    if org
      repos = repos.filter (item, index) ->
        item.get('owner.login') == org

    if Ember.isBlank(filter)
      repos
    else
      repos.filter (item, index) ->
        item.slug.match(new RegExp(filter))

  ).property('filter', 'model', 'org')

  updateFilter: () ->
    value = @get('_lastFilterValue')
    @transitionToRoute queryParams: { filter: value }
    @set('filter', value)

  selectedOrg: (->
    @get('orgs').findBy('login', @get('org'))
  ).property('org', 'orgs.[]')

  orgs: (->
    orgs = Ember.ArrayProxy.create(
      content: []
      isLoading: true
    )

    apiEndpoint = config.apiEndpoint
    $.ajax(apiEndpoint + '/v3/orgs', {
      headers: {
        Authorization: 'token ' + @auth.token()
      }
    }).then (response) ->
      array = response.organizations.map( (org) ->
        Ember.Object.create(org)
      )
      orgs.set('content', array)
      orgs.set('isLoading', false)

    orgs
  ).property()

  actions:
    updateFilter: (value) ->
      @set('_lastFilterValue', value)
      Ember.run.throttle this, @updateFilter, [], 200, false

    selectOrg: (org) ->
      login = if org then org.get('login') else null
      @set('org', login)

`export default Controller`
