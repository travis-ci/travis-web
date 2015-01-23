require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  activate: ->
    @get('stylesheetsManager').disable('main')
    @get('stylesheetsManager').enable('dashboard')

  deactivate: ->
    @get('stylesheetsManager').enable('main')
    @get('stylesheetsManager').disable('dashboard')

  model: ->
    return new Ember.RSVP.Promise(->)
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

Travis.DashboardRoute = Route
