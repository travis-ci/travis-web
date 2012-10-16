Travis.Foo = Travis.Model.extend
  name:        DS.attr('string')
  description: DS.attr('string')

record = null
store = null

$.mockjax
  url: '/foos/1'
  responseTime: 10
  responseText: { foo: { id: 1, name: 'foo', description: 'bar' } }

describe 'Travis.Model', ->
  describe 'with incomplete record', ->
    beforeEach ->
      store = Travis.Store.create()

      attrs = {
        id: 1
        name: 'foo'
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
