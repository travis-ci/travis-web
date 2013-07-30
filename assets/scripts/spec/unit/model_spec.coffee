fullPostHash = null
Post = null
Author = null
Comment = null

module "Travis.Model",
  setup: ->
    fullPostHash = {
      id: '1',
      title: 'foo',
      published_at: 'today',

      author_id: '1',
      comment_ids: ['1', '2']
    }

    Author = Travis.Model.extend(
      name: Ember.attr('string')
    )
    Author.toString = -> return 'Author'

    Comment = Travis.Model.extend(
      body: Ember.attr('string')
    )
    Comment.toString = -> return 'Comment'

    Post = Travis.Model.extend(
      title: Ember.attr('string'),
      publishedAt: Ember.attr('string'),

      author: Ember.belongsTo(Author, { key: 'author_id' }),
      comments: Ember.hasMany(Comment, { key: 'comment_ids' })
    )
    Post.toString = -> return 'Post'

    Comment.adapter = Ember.FixtureAdapter.create()
    Author.adapter = Ember.FixtureAdapter.create()
    Post.adapter = Ember.FixtureAdapter.create()

    Author.load([
      { id: '1', name: 'drogus' }
    ])
    Comment.load([
      { id: '1', body: 'comment 1' },
      { id: '2', body: 'comment 2' }
    ])
test "new data can be merged into the record", ->
  delete fullPostHash.title
  delete fullPostHash.author_id
  delete fullPostHash.comment_ids
  post = Post.findFromCacheOrLoad(fullPostHash)

  post.loadTheRest = (->)

  equal(post.get('title'), null, 'title should be null')
  equal(post.get('comments.length'), 0, 'comments should be empty')
  equal(post.get('author'), null, 'author should be null')

  Ember.run -> post.merge(title: 'teh title', comment_ids: ['1', '2'], author_id: '1')

  author = null
  Ember.run -> author = Author.find('1').get('name')
  title = null
  Ember.run -> title = post.get('title')
  console.log('title', title)

  equal(post.get('title'), 'teh title', 'title should be updated')
  equal(post.get('comments.length'), 2, 'comments should be updated and have length of 2')
  equal(post.get('comments.firstObject.body'), 'comment 1', 'comment should be loaded')
  equal(author, 'drogus', 'author should be loaded')
  equal(post.get('publishedAt'), 'today', 'existing attributes are not overwritten')

module "Travis.Model.loadOrMerge",
  setup: ->
    Post = Travis.Model.extend(
      title: Ember.attr('string')
    )
    Post.toString = -> return 'Post'

test "it doesn't update record if skipIfExists is passed and record is already in store", ->
  Post.load([{id: '1', title: 'foo'}])

  post = Post.find('1')
  equal(post.get('title'), 'foo', 'precondition - title of the post should be set')

  Ember.run ->
    Travis.loadOrMerge(Post, { id: '1', title: 'bar' }, { skipIfExists: true })

  equal(post.get('title'), 'foo', 'title should stay unchanged')

test "it updates record if record is already in the store", ->
  Post.load([{id: '1', title: 'foo'}])

  post = Post.find('1')
  equal(post.get('title'), 'foo', 'precondition - title of the post should be set')

  Ember.run ->
    Travis.loadOrMerge(Post, { id: '1', title: 'bar' })

  equal(post.get('title'), 'bar', 'title should be updated')

test "record is not instantiated by default", ->
  reference = null
  Ember.run ->
    reference = Travis.loadOrMerge(Post, { id: '1', title: 'bar' })

  equal(reference.id, '1', 'reference should be created')
  ok(Ember.isNone(reference.record), 'record should not be created')

  post = null
  Ember.run -> post = Post.find('1')
  equal(post.get('title'), 'bar', 'record should be loaded from cached data')
  equal(reference.record, post, 'record should be created')

test "data is merged to the existing data cache", ->
  Post.load([{id: '1', title: 'foo'}])

  Ember.run ->
    Travis.loadOrMerge(Post, { id: '1', title: 'bar' })

  post = Post.find('1')
  equal(post.get('title'), 'bar', 'title should be updated')
