require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  model: ->
    apiEndpoint = @get('config').api_endpoint
    $.ajax(apiEndpoint + '/repos?member=lislis', {
      beforeSend: (xhr) -> 
        xhr.setRequestHeader('accept', 'application/json; version=2')
    }).then (response) ->
      response.repos.map (elem) ->
        [owner, name] = elem.slug.split('/')
        elem.owner = owner
        elem.name = name
        Ember.Object.create(elem)

Travis.DashboardRepositoriesRoute = Route
