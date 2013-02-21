record = null
store = null

describe 'Travis.Model - merge', ->
  beforeEach ->
    Travis.Foo = Travis.Model.extend
      login:        DS.attr('string')
      firstName:    DS.attr('string')
      email:        DS.attr('string')

      bar:          DS.belongsTo('Travis.Bar')

    Travis.Bar = Travis.Model.extend
      foos: DS.hasMany('Travis.Foo')

    store = Travis.Store.create()

  afterEach ->
    delete Travis.Foo
    delete Travis.Bar
    store.destroy()

  it 'updates the attributes of materialized record', ->
    data = { id: '1', firstName: 'Piotr', email: 'drogus@example.org' }
    store.load(Travis.Foo, { id: '1' }, data)
    record = store.find(Travis.Foo, '1')

    changes = 0

    observer = ->
      changes += 1
    record.addObserver 'firstName', observer

    Ember.run ->
      store.merge(Travis.Foo, { id: '1', first_name: 'Peter', login: 'drogus' })

    record.removeObserver 'firstName', observer

    expect(changes).toEqual(1)
    expect(record.get('firstName')).toEqual('Peter')
    expect(record.get('login')).toEqual('drogus')
    expect(record.get('email')).toEqual('drogus@example.org')

  it 'updates belongsTo relationship of materialized record', ->
    data = { id: '1', login: 'drogus', bar_id: '1' }
    store.load(Travis.Foo, data, { id: '1' })
    store.load(Travis.Bar, { id: '1' }, { id: '1' })
    store.load(Travis.Bar, { id: '2' }, { id: '2' })
    record = store.find(Travis.Foo, '1')

    changed = false

    observer = ->
      changed = true
    record.addObserver 'bar', observer

    Ember.run ->
      store.merge(Travis.Foo, { id: '1', bar_id: '2' })

    record.removeObserver 'bar', observer

    bar = store.find(Travis.Bar, '2')

    expect(changed).toEqual(true)
    expect(record.get('bar')).toEqual(bar)

  it 'updates hasMany relationship of materialized record', ->
    data = { id: '1', foo_ids: [1] }
    store.load(Travis.Bar, data, { id: '1' })
    store.load(Travis.Foo, { id: '1' }, { id: '1' })
    store.load(Travis.Foo, { id: '2' }, { id: '2' })

    record = store.find(Travis.Bar, '1')

    changed = false

    observer = ->
      changed = true
    record.addObserver 'foos.length', observer

    Ember.run ->
      store.merge(Travis.Bar, { id: '1', foo_ids: [1, 2] })

    record.removeObserver 'foos.length', observer

    expect(changed).toEqual(true)
    expect(record.get('foos.length')).toEqual(2)
    expect(record.get('foos').mapProperty('id')).toEqual(['1', '2'])

  it 'loads given data if it\'s not in the store yet', ->
    store.merge(Travis.Foo, { id: '1', login: 'drogus' })

    record = store.find(Travis.Foo, 1)

    expect(record.get('login')).toEqual('drogus')
    expect(record.get('email')).toEqual(null)

  it 'merges data if it\'s just loaded into store', ->
    store.load(Travis.Foo, { id: '1', login: 'drogus', email: 'drogus@example.org' }, { id: '1' })
    store.merge(Travis.Foo, { id: '1', login: 'svenfuchs' })

    record = store.find(Travis.Foo, 1)

    expect(record.get('login')).toEqual('svenfuchs')
    expect(record.get('email')).toEqual('drogus@example.org')
