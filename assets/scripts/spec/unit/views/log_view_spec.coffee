view = null
store = null
record = null

describe 'Travis.LogView', ->
  beforeEach ->
    store = Travis.Store.create()

  afterEach ->
    store.destroy()
    view.remove()
    view.destroy()

  it 'works fine with existing log, which is appended', ->
    store.load Travis.Artifact, 1, { id: 1, body: '$ start' }
    log = Travis.Artifact.find(1)

    Ember.run ->
      view = Travis.LogView.create(context: null)
      view.append()

    expect( $('#log').length ).toEqual 1
    console.log $('#log')

    job = Ember.Object.create log: log, subscribe: (-> )

    Ember.run ->
      view.set 'context', job
      log.set 'isLoaded', true

    expect( view.$('#log p').length ).toEqual 1
    expect( view.$('#log p').text().trim() ).toEqual '1$ start'

    Ember.run ->
      log.append('$ end')

    expect( view.$('#log p').length ).toEqual 2
    expect( view.$('#log p').text().trim() ).toEqual '1$ start2$ end'

  it 'works fine with log already attahed to view', ->
    store.load Travis.Artifact, 1, { id: 1, body: '$ start' }
    log = Travis.Artifact.find(1)
    job = Ember.Object.create log: log, subscribe: (-> )

    Ember.run ->
      view = Travis.LogView.create()
      view.set('context', job)
      view.append()

    Ember.run ->
      log.append('end')

    expect( view.$('#log p').length ).toEqual 2
    expect( view.$('#log p').text().trim() ).toEqual '1$ start2end'

  it 'folds items', ->
    store.load Travis.Artifact, 1, { id: 1, body: '$ start' }
    log = Travis.Artifact.find(1)
    job = Ember.Object.create log: log, subscribe: (-> )

    Ember.run ->
      view = Travis.LogView.create()
      view.set('context', job)
      view.append()

    Ember.run ->
      log.append '$ bundle install\n1\n2'

    Ember.run ->
      log.append '3\n4\n$ something'

    expect( view.$('#log > p').length ).toEqual 2
    expect( view.$('#log .fold.bundle').length ).toEqual 1
    expect( view.$('#log .fold.bundle > p').length ).toEqual 5
