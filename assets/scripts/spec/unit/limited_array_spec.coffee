module 'Travis.LimitedArray'

test 'limits given content', ->
  content = [1, 2, 3]
  array = Travis.LimitedArray.create content: content, limit: 2
  equal( array.get('length'), 2 )
  deepEqual( array.toArray(), [1, 2] )

test 'inserts content at the right place when unshifting', ->
  content = [1, 2, 3]
  array = Travis.LimitedArray.create content: content, limit: 2
  content.unshiftObject 0
  equal( array.get('length'), 2 )
  deepEqual( array.toArray(), [0, 1] )

test 'does not insert content when it\'s inserted not in the limited range', ->
  content = [1, 2, 3]
  array = Travis.LimitedArray.create content: content, limit: 2
  content.pushObject 0
  equal( array.get('length'), 2 )
  deepEqual( array.toArray(), [1, 2] )

test 'properly removes items', ->
  content = [1, 2, 3]
  array = Travis.LimitedArray.create content: content, limit: 2
  content.shiftObject()

  equal( array.get('length'), 2 )
  deepEqual( array.toArray(), [2, 3] )

  content.shiftObject()

  equal( array.get('length'), 1 )
  deepEqual( array.toArray(), [3] )

  content.shiftObject()

  equal( array.get('length'), 0)

test 'allows to expand array to show all items', ->
  content = [1, 2, 3]
  array = Travis.LimitedArray.create content: content, limit: 2

  Ember.run ->
    array.showAll()

  equal( array.get('length'), 3)
  deepEqual( array.toArray(), [1, 2, 3])
