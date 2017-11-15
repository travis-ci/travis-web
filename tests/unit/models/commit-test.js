import { run } from '@ember/runloop';
import { moduleForModel, test } from 'ember-qunit';
moduleForModel('commit', 'Unit | Model | commit', {
  needs: ['model:build', 'service:external-links', 'service:auth']
});

test('finds out if author is also committer', function (assert) {
  const model = this.subject();
  run(function () {
    return model.setProperties({
      authorEmail: 'author@example.com',
      committerEmail: 'committer@example.com',
      authorName: 'Author Name',
      committerName: 'Committer Name'
    });
  });
  assert.equal(model.get('authorIsCommitter'), false, 'should detect different author and committer');

  run(function () {
    return model.setProperties({
      authorEmail: 'author@example.com',
      committerEmail: 'author@example.com',
      authorName: 'Author Name',
      committerName: 'Author Name'
    });
  });
  assert.equal(model.get('authorIsCommitter'), true, 'should detect same author and committer');
});
