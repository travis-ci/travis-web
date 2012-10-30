Travis.Foo = Travis.Model.extend
  name:        DS.attr('string')
  description: DS.attr('string')
  lastName:    DS.attr('string')

  bar:         DS.belongsTo('Travis.Bar')
  niceBar:     DS.belongsTo('Travis.Bar')
  veryNiceBar: DS.belongsTo('Travis.Bar', key: 'very_nice_bar_indeed_id')

Travis.Bar = Travis.Model.extend()

record = null
store = null

$.mockjax
  url: '/foos/1'
  responseTime: 10
  responseText: { foo: { id: 1, name: 'foo', description: 'bar' } }

describe 'Travis.Model', ->
  beforeEach ->
    store = Travis.Store.create()

  afterEach ->
    store.destroy()

  describe 'with incomplete record with loaded associations', ->
    beforeEach ->
      attrs = {
        id: 1
        bar_id: 2
        nice_bar_id: 3
        very_nice_bar_indeed_id: 4
      }
      record = store.loadIncomplete(Travis.Foo, attrs)
      store.load(Travis.Bar, id: 2)
      store.load(Travis.Bar, id: 3)
      store.load(Travis.Bar, id: 4)

    it 'does not load record on association access', ->
      expect( record.get('bar.id') ).toEqual 2
      expect( record.get('niceBar.id') ).toEqual 3
      expect( record.get('veryNiceBar.id') ).toEqual 4
      waits 50
      runs ->
        expect( record.get('complete') ).toBeFalsy()

  describe 'with incomplete record without loaded associations', ->
    beforeEach ->
      attrs = {
        id: 1
      }
      record = store.loadIncomplete(Travis.Foo, attrs)

    it 'loads record based on regular association key', ->
      record.get('bar')
      waits 50
      runs ->
        expect( record.get('complete') ).toBeTruthy()

    it 'loads record based on camel case association key', ->
      record.get('niceBar')
      waits 50
      runs ->
        expect( record.get('complete') ).toBeTruthy()

    it 'loads record based on ssociation with explicit key', ->
      record.get('veryNiceBar')
      waits 50
      runs ->
        expect( record.get('complete') ).toBeTruthy()

  describe 'with incomplete record', ->
    beforeEach ->
      attrs = {
        id: 1
        name: 'foo'
        last_name: 'foobar'
      }
      record = store.loadIncomplete(Travis.Foo, attrs)

    it 'shows if attribute is loaded', ->
      expect( record.isAttributeLoaded('name') ).toBeTruthy()
      expect( record.isAttributeLoaded('description') ).toBeFalsy()

    it 'does not trigger a request when getting known attribute', ->
      expect( record.get('name') ).toEqual 'foo'
      waits 50
      runs ->
        expect( record.get('complete') ).toBeFalsy()

    it 'loads missing data if getPath is used', ->
      other = Em.Object.create(record: record)
      expect( other.get('record.description') ).toBeNull()

      waits 50
      runs ->
        expect( other.get('record.description') ).toEqual 'bar'
        expect( record.get('isComplete') ).toBeTruthy()

    it 'loads missing data on try to get it', ->
      expect( record.get('name') ).toEqual 'foo'
      expect( record.get('description') ).toBeNull()
      waits 50
      runs ->
        expect( record.get('description') ).toEqual 'bar'
        expect( record.get('complete') ).toBeTruthy()
        expect( record.get('isComplete') ).toBeTruthy()

    it 'does not set incomplete on the record twice', ->
      record.get('description')
      waits 50
      runs ->
        store.loadIncomplete(Travis.Foo, id: 1)
        expect( record.get('incomplete') ).toBeFalsy()

    it 'does not load data on non attribute', ->
      record.get('foobarbaz')
      waits 50
      runs ->
        expect( record.get('incomplete') ).toBeTruthy()

    it 'works with camel case values', ->
      expect( record.get('lastName') ).toEqual 'foobar'
      waits 50
      runs ->
        expect( record.get('complete') ).toBeFalsy()

    it 'adds takes into account additional data loaded as incomplete', ->
      record = store.loadIncomplete(Travis.Foo, { id: 1, description: 'baz' })
      expect( record.get('description') ).toEqual 'baz'
      waits 50
      runs ->
        expect( record.get('complete') ).toBeFalsy()

  describe 'with complete record', ->
    beforeEach ->
      id = 5
      attrs = {
        id: id
        name: 'foo'
      }

      store.load(Travis.Foo, id, attrs)
      record = Travis.Foo.find(id)

    it 'is marked as completed', ->
      expect( record.get('complete') ).toBeTruthy()

    it 'allows to get regular attribute', ->
      expect( record.get('name') ).toEqual 'foo'

    it 'allows to check attribute state', ->
      expect( record.isAttributeLoaded('name') ).toBeFalsy()
