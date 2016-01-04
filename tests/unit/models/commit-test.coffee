`import { moduleForModel, test } from 'ember-qunit'`

moduleForModel 'commit', 'Unit | Model | commit', needs: ['model:build']

test 'calculation of avatar urls via Gravatar', ->
  model = @subject()
  Ember.run ->
    model.setProperties
      authorEmail: 'author@example.com'
      committerEmail: 'author@example.com'
      authorAvatarUrl: null
      committerAvatarUrl: null
  equal model.get('authorAvatarUrl'), 'https://www.gravatar.com/avatar/5c1e6d6e64e12aca17657581a48005d1?s=40&d=https%3A%2F%2Ftravis-ci.org%2Fimages%2Fui%2Fdefault-avatar.png', 'correctly sets gravatar image'
  equal model.get('committerAvatarUrl'), 'https://www.gravatar.com/avatar/5c1e6d6e64e12aca17657581a48005d1?s=40&d=https%3A%2F%2Ftravis-ci.org%2Fimages%2Fui%2Fdefault-avatar.png', 'correctly sets gravatar image'

test 'calculation of avatar urls via overriding parameter', ->
  model = @subject()
  Ember.run ->
    model.setProperties
      authorEmail: 'author@example.com'
      committerEmail: 'author@example.com'
      authorAvatarUrl: 'http://example.com/test.jpg'
      committerAvatarUrl: 'http://example.com/test2.jpg'
  equal model.get('authorAvatarUrl'), 'http://example.com/test.jpg', 'correctly sets avatar'
  equal model.get('committerAvatarUrl'), 'http://example.com/test2.jpg', 'correctly sets avatar'
