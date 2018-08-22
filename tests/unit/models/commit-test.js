import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | commit', function (hooks) {
  setupTest(hooks);

  test('finds out if author is also committer', function (assert) {
    const model = run(() => this.owner.lookup('service:store').createRecord('commit'));
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
});
