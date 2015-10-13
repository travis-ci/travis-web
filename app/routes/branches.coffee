`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend

  model: (params) ->
    apiEndpoint = config.apiEndpoint
    repoId = @modelFor('repo').get('id')

    allTheBranches = Ember.ArrayProxy.create()

    options = {}
    if @get('auth.signedIn')
      options.headers = { Authorization: "token #{@auth.token()}" }

    $.ajax("#{apiEndpoint}/v3/repo/#{repoId}/branches?include=build.commit&limit=100&sort_by=exists_on_github", options).then (response) ->
      allTheBranches = response.branches

      defaultBranch = allTheBranches.filter (item, index) ->
        item if item.repository.default_branch['@href'] == item['@href']
      
      allTheBranches
      unless defaultBranch.length == 1
        $.ajax("#{apiEndpoint}/v3/repo/#{repoId}/branches?include=build.commit&limit=100&offset=1&sort_by=exists_on_github", options).then (response) ->
          allTheBranches = allTheBranches.concat(response.branches)

          allTheBranches

  activate: () ->
    $('.tab.tabs--main li').removeClass('active')
    $('#tab_branches').addClass('active')

  deactivate: () ->
    $('#tab_branches').removeClass('active')


`export default Route`
