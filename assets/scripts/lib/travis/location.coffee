Travis.Location = Ember.HistoryLocation.extend
  onUpdateURL: (callback) ->
    guid = Ember.guidFor(this)

    Ember.$(window).bind 'popstate.ember-location-'+guid, (e) ->
      callback(location.pathname + location.hash)

  getURL: ->
    location = @get('location')
    location.pathname + location.hash

  initState: ->
    @replaceState(@getURL());
    Ember.set(this, 'history', window.history)

Ember.Location.implementations['travis'] = Travis.Location
