record = null

module "Travis.Commit",
  setup: ->
  teardown: ->
    Travis.Commit.resetData()

test 'it recognizes when author is committer', ->
  Travis.Commit.load [
    {
      id: 1,
      committer_name: 'Jimmy',
      committer_email: 'jimmy@example.com',
      author_name: 'Jimmy',
      author_email: 'jimmy@example.com'
    }
  ]

  Ember.run ->
    record = Travis.Commit.find 1

    console.log(record.get('authorName'))
    equal(true, record.get('authorIsCommitter'))

test 'it recognizes when author is not committer', ->
  Travis.Commit.load [
    {
      id: 1,
      committer_name: 'Jimmy',
      committer_email: 'jimmy@example.com',
      author_name: 'John',
      author_email: 'john@example.com'
    }
  ]

  Ember.run ->
    record = Travis.Commit.find 1
    console.log(record.get('authorName'))
    equal(false, record.get('authorIsCommitter'))
