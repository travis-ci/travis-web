createChunk = (number, content) ->
  Em.Object.create(number: number, content: content)

describe 'Travis.ChunkBuffer', ->
  it 'waits for parts to be in order before revealing them', ->
    buffer = Travis.ChunkBuffer.create(content: [])

    buffer.pushObject createChunk(3, "baz")
    buffer.pushObject createChunk(2, "bar")

    expect(buffer.get('length')).toEqual(0)

    buffer.pushObject createChunk(1, "foo")

    expect(buffer.get('length')).toEqual(3)

    expect(buffer.toArray()).toEqual(['foo', 'bar', 'baz'])

  it 'ignores a part if it fails to be delivered within timeout', ->
    buffer = Travis.ChunkBuffer.create(content: [], timeout: 20, checkTimeoutFrequency: 5)

    buffer.pushObject createChunk(3, "baz")

    expect(buffer.get('length')).toEqual(0)

    buffer.pushObject createChunk(1, "foo")

    expect(buffer.get('length')).toEqual(1)

    waits 40
    runs ->
      expect(buffer.get('length')).toEqual(2)
      expect(buffer.toArray()).toEqual(['foo', 'baz'])

      buffer.destroy()

  it 'works correctly when parts are passed as content', ->
    content = [createChunk(2, 'bar')]

    buffer = Travis.ChunkBuffer.create(content: content)

    expect(buffer.get('length')).toEqual(0)

    buffer.pushObject createChunk(1, "foo")

    expect(buffer.get('length')).toEqual(2)
    expect(buffer.toArray()).toEqual(['foo', 'bar'])

  it 'works correctly when parts duplicated', ->
    buffer = Travis.ChunkBuffer.create(content: [])

    buffer.pushObject createChunk(1, "foo")
    buffer.pushObject createChunk(2, "bar")
    buffer.pushObject createChunk(3, "baz")

    buffer.pushObject createChunk(2, "bar")
    buffer.pushObject createChunk(3, "baz")
    buffer.pushObject createChunk(4, "qux")

    expect(buffer.get('length')).toEqual(4)
    expect(buffer.toArray()).toEqual(['foo', 'bar', 'baz', 'qux'])

  it 'fires array observers properly', ->
    changes = []
    buffer = Travis.ChunkBuffer.create(content: [])

    observer = Em.Object.extend(
      init: ->
        @_super.apply this, arguments

        @get('content').addArrayObserver this,
          willChange: 'arrayWillChange',
          didChange: 'arrayDidChange'

      arrayWillChange: (->)
      arrayDidChange: (array, index, removedCount, addedCount) ->
        changes.pushObject([index, addedCount])
    ).create(content: buffer)

    buffer.pushObject createChunk(2, "baz")

    expect(buffer.get('length')).toEqual(0)
    expect(changes.length).toEqual(0)

    buffer.pushObject createChunk(1, "foo")

    expect(buffer.get('length')).toEqual(2)
    expect(changes.length).toEqual(1)
    expect(changes[0]).toEqual([0, 2])

  it 'sets next to start if start is given at init', ->
    buffer = Travis.ChunkBuffer.create(content: [], start: 5)
    expect(buffer.get('next')).toEqual(5)
