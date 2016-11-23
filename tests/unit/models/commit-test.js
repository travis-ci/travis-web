import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';
moduleForModel('commit', 'Unit | Model | commit', {
  needs: ['model:build', 'service:external-links', 'service:auth']
});

test('calculation of avatar urls via Gravatar', function (assert) {
  const model = this.subject();
  Ember.run(function () {
    return model.setProperties({
      authorEmail: 'author@example.com',
      committerEmail: 'author@example.com',
      authorAvatarUrl: null,
      committerAvatarUrl: null
    });
  });
  assert.equal(model.get('authorAvatarUrlOrGravatar'), 'https://www.gravatar.com/avatar/5c1e6d6e64e12aca17657581a48005d1?s=40&d=blank', 'correctly sets gravatar image');
  assert.equal(model.get('committerAvatarUrlOrGravatar'), 'https://www.gravatar.com/avatar/5c1e6d6e64e12aca17657581a48005d1?s=40&d=blank', 'correctly sets gravatar image');
});

test('calculation of avatar urls via overriding parameter', function (assert) {
  const model = this.subject();
  Ember.run(function () {
    return model.setProperties({
      authorEmail: 'author@example.com',
      committerEmail: 'author@example.com',
      authorAvatarUrl: 'http://example.com/test.jpg',
      committerAvatarUrl: 'http://example.com/test2.jpg'
    });
  });
  assert.equal(model.get('authorAvatarUrlOrGravatar'), 'http://example.com/test.jpg', 'correctly sets avatar');
  assert.equal(model.get('committerAvatarUrlOrGravatar'), 'http://example.com/test2.jpg', 'correctly sets avatar');
});
