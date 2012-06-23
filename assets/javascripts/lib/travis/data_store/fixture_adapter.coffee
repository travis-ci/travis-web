@Travis.FixtureAdapter = DS.Adapter.extend
  find: (store, type, id) ->
    fixtures = type.FIXTURES
    Ember.assert "Unable to find fixtures for model type " + type.toString(), !!fixtures
    return  if fixtures.hasLoaded
    setTimeout (->
      store.loadMany type, fixtures
      fixtures.hasLoaded = true
    ), 300

  findMany: ->
    @find.apply this, arguments

  findAll: (store, type) ->
    fixtures = type.FIXTURES
    Ember.assert "Unable to find fixtures for model type " + type.toString(), !!fixtures
    ids = fixtures.map (item, index, self) ->
      item.id
    store.loadMany type, ids, fixtures

  findQuery: (store, type, params, array) ->
    fixtures = type.FIXTURES
    Ember.assert "Unable to find fixtures for model type " + type.toString(), !!fixtures
    hashes = for fixture in fixtures
      matches = for key, value of params
        key == 'orderBy' || fixture[key] == value
      if matches.reduce((a, b) -> a && b) then fixture else null
    array.load(hashes.compact())


