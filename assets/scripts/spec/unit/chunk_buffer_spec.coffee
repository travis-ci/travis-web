createChunk = (number, content) ->
  Em.Object.create(number: number, content: content)

describe 'Travis.ChunkBuffer', ->
  it 'waits for parts to be in order before revealing them', ->
    content = []
    buffer = Travis.ChunkBuffer.create(content: content)

    content.pushObject createChunk(2, "baz")
    content.pushObject createChunk(1, "bar")

    expect(buffer.get('length')).toEqual(0)

    content.pushObject createChunk(0, "foo")

    expect(buffer.get('length')).toEqual(3)

    expect(buffer.toArray()).toEqual(['foo', 'bar', 'baz'])

  it 'ignores a part if it fails to be delivered within timeout', ->
    expect 4

    content = []
    buffer = Travis.ChunkBuffer.create(content: content, timeout: 10)

    content.pushObject createChunk(2, "baz")

    expect(buffer.get('length')).toEqual(0)

    content.pushObject createChunk(0, "foo")

    expect(buffer.get('length')).toEqual(1)

    stop()
    setTimeout( (->
      expect(buffer.get('length')).toEqual(2)
      expect(buffer.toArray()).toEqual(['foo', 'bar', 'baz'])
    ), 20)

  it 'works correctly when parts are passed as content', ->
    content = [createChunk(1, 'bar')]

    buffer = Travis.ChunkBuffer.create(content: content)

    expect(buffer.get('length')).toEqual(0)

    content.pushObject createChunk(0, "foo")

    expect(buffer.get('length')).toEqual(2)
    expect(buffer.toArray()).toEqual(['foo', 'bar'])


