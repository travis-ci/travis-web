Travis.Foo = Travis.Model.extend
  name:        DS.attr('string')
  description: DS.attr('string')
  lastName:    DS.attr('string')

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
