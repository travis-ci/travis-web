fullPostHash = null
Post = null
Author = null

module "Travis.Model - incomplete",
  setup: ->
    fullPostHash = {
      id: '1',
      title: 'foo',
      published_at: 'today',

      author_id: '1'
    }

    Author = Travis.Model.extend()

    Post = Travis.Model.extend(
      title: Ember.attr('string'),
      publishedAt: Ember.attr('string', key: 'published_at'),

      author: Ember.belongsTo(Author, { key: 'author_id' })
    )

    Post.adapter = Ember.FixtureAdapter.create()

test "record is marked as incomplete if attributes are missing when loading a record", ->
  Post.load([{ id: '1', title: 'foo' }])

  record = Post.find('1')
  ok(record.get('incomplete'), 'record should be incomplete')
  equal(record.get('title'), 'foo', 'attributes should be accessible')

test "record is marked as complete if missing attributes are loaded", ->
  Post.load([{ id: '1', title: 'foo' }])

  record = Post.find('1')
  ok(record.get('incomplete'), 'record should be complete')
  equal(record.get('title'), 'foo', 'attributes should be accessible')

  record.load('1', fullPostHash)

  ok(!record.get('incomplete'), 'record should be complete')

test "record is marked as incomplete if belongsTo key is missing", ->
  delete(fullPostHash.author_id)
  Post.load([fullPostHash])

  record = Post.find('1')
  ok(record.get('incomplete'), 'record should be incomplete')

test "proeperty can be loaded as null, which means that the property is still loaded", ->
  fullPostHash.author_id = null
  fullPostHash.title = null

  Post.load([fullPostHash])

  record = Post.find('1')
  ok(!record.get('incomplete'), 'record should be complete')
  equal(record.get('title'), null, 'title should be null')

test "when accessing missing property, record is loaded", ->
  Post.FIXTURES = [fullPostHash]
  Post.load([{ id: '1' }])

  record = null
  Ember.run -> record = Post.find('1')

  ok(record.get('incomplete'), 'record should be incomplete')

  publishedAt = null
  Ember.run -> publishedAt = record.get('publishedAt')

  ok(!publishedAt, 'publishedAt should be missing')

  stop()
  setTimeout( ->
    start()

    Ember.run -> publishedAt = record.get('publishedAt')
    equal(publishedAt, 'today', 'publishedAt should be loaded')
    ok(!record.get('incomplete'), 'record should be complete')
  , 50)

