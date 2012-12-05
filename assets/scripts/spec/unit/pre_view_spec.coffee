view = null
store = null
record = null

describe 'Travis.PreView', ->
  beforeEach ->
    store = Travis.Store.create()

  afterEach ->
    store.destroy()
    view.remove()
    view.destroy()

  it 'works fine with existing log, which is appended', ->
    store.load Travis.Artifact, 1, { id: 1, body: '$ start\n' }
    log = Travis.Artifact.find(1)
    log.set('version', 1)

    Ember.run ->
      view = Travis.PreView.create(log: null)
      view.append()

    expect( view.$('#log').length ).toEqual 1

    Ember.run ->
      view.set 'log', log
      log.set 'isLoaded', true

    waits 50
    runs ->
      expect( view.$('#log p').length ).toEqual 1
      expect( view.$('#log p').text().trim() ).toEqual '1$ start'

      Ember.run ->
        log.append('$ end')

      waits 50
      runs ->
        expect( view.$('#log p').length ).toEqual 2
        expect( view.$('#log p').text().trim() ).toEqual '1$ start2$ end'

  it 'works fine with log already attahed to view', ->
    store.load Travis.Artifact, 1, { id: 1, body: '$ start\n' }
    log = Travis.Artifact.find(1)

    Ember.run ->
      view = Travis.PreView.create()
      view.set('log', log)
      view.append()

    Ember.run ->
      log.append('end')

    waits 50
    runs ->
      expect( view.$('#log p').length ).toEqual 2
      expect( view.$('#log p').text().trim() ).toEqual '1$ start2end'

  it 'folds items', ->
    store.load Travis.Artifact, 1, { id: 1, body: '$ start\n' }
    log = Travis.Artifact.find(1)

    Ember.run ->
      view = Travis.PreView.create()
      view.set('log', log)
      view.append()

    Ember.run ->
      log.append '$ bundle install\n1\n2\n'

    Ember.run ->
      log.append '3\n4\n$ something'

    waits 50
    runs ->
      expect( view.$('#log > p').length ).toEqual 2
      expect( view.$('#log .fold.bundle').length ).toEqual 1
      expect( view.$('#log .fold.bundle > p').length ).toEqual 5


  it 'works properly with fragment document', ->
    store.load Travis.Artifact, 1, { id: 1, body: '' }
    log = Travis.Artifact.find(1)

    Ember.run ->
      view = Travis.PreView.create()
      view.set('log', log)
      view.append()

    waits 50
    runs ->
      payloads = [
        { number: 1, content: 'foo' }
        { number: 1, content: 'bar', append: true }
      ]

      # it should work even if we need to append to fragment in memory
      view.appendLog(payloads)

      expect( view.$('#L1').parent().text().trim() ).toEqual '1foobar'

      # now, let's append more to this line, it's in DOM already
      view.appendLog([ { number: 1, content: 'baz', append: true } ])

      expect( view.$('#L1').parent().text().trim() ).toEqual '1foobarbaz'

      payloads = [
        { number: 1, content: 'foo', replace: true }
      ]
      # replace should work in DOM
      view.appendLog(payloads)
      expect( view.$('#L1').parent().text().trim() ).toEqual '1foo'

      payloads = [
        { number: 2, content: 'foo' }
        { number: 2, content: 'bar', replace: true }
      ]
      # replace should work when element is in fragment
      view.appendLog(payloads)
      expect( view.$('#L2').parent().text().trim() ).toEqual '2bar'

      payloads = [
        { number: 3, content: '$ bundle install', fold: 'bundle' }
        { number: 4, content: 'Installing rails', fold: 'bundle', foldContinuation: true }
      ]
      # folds should work properly with fragment
      view.appendLog(payloads)
      expect( view.$('.bundle #L3').parent().text().trim() ).toEqual '3$ bundle install'
      expect( view.$('.bundle #L4').parent().text().trim() ).toEqual '4Installing rails'
      expect( view.$('.bundle > p').length ).toEqual 2

      payloads = [
        { number: 5, content: 'Installing travis', fold: 'bundle', foldContinuation: true }
      ]
      # folds should also work when already in DOM
      view.appendLog(payloads)
      expect( view.$('.bundle #L5').parent().text().trim() ).toEqual '5Installing travis'
      expect( view.$('.bundle > p').length ).toEqual 3

      # regular line append
      view.appendLog([ { number: 6, content: 'next'} ])
      expect( view.$('#L6').parent().text().trim() ).toEqual '6next'

      # openFold when in fragment
      payloads = [
        { number: 7, content: '$ install', fold: 'install' }
        { number: 8, content: 'Installing foo', fold: 'install', foldContinuation: true }
        { number: 9, content: 'error', openFold: true, fold: 'install', foldContinuation: true }
      ]
      # folds should work properly with fragment
      view.appendLog(payloads)
      expect( view.$('.install').hasClass('show-first-line') ).toEqual false

      # end fold when in fragment
      payloads = [
        { number: 10, content: '$ install', fold: 'install2' }
        { number: 11, content: 'Installing foo', fold: 'install2', foldEnd: true, foldContinuation: true }
      ]
      # folds should work properly with fragment
      view.appendLog(payloads)
      expect( view.$('.install2').hasClass('show-first-line') ).toEqual false
