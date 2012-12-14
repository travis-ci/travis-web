describe 'Travis.LimitedArray', ->
  it 'limits given content', ->
    content = [1, 2, 3]
    array = Travis.LimitedArray.create content: content, limit: 2
    expect( array.get('length') ).toEqual 2
    expect( array.toArray() ).toEqual [1, 2]

  it 'inserts content at the right place when unshifting', ->
    content = [1, 2, 3]
    array = Travis.LimitedArray.create content: content, limit: 2
    content.unshiftObject 0
    expect( array.get('length') ).toEqual 2
    expect( array.toArray() ).toEqual [0, 1]

  it 'does not insert content when it\'s inserted not in the limited range', ->
    content = [1, 2, 3]
    array = Travis.LimitedArray.create content: content, limit: 2
    content.pushObject 0
    expect( array.get('length') ).toEqual 2
    expect( array.toArray() ).toEqual [1, 2]

  it 'properly removes items', ->
    content = [1, 2, 3]
    array = Travis.LimitedArray.create content: content, limit: 2
    content.shiftObject()

    expect( array.get('length') ).toEqual 2
    expect( array.toArray() ).toEqual [2, 3]

    content.shiftObject()

    expect( array.get('length') ).toEqual 1
    expect( array.toArray() ).toEqual [3]

    content.shiftObject()

    expect( array.get('length') ).toEqual 0

  it 'allows to expand array to show all items', ->
    content = [1, 2, 3]
    array = Travis.LimitedArray.create content: content, limit: 2

    array.showAll()

    expect( array.get('length') ).toEqual 3
    expect( array.toArray() ).toEqual [1, 2, 3]
