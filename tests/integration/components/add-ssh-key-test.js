import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import fillIn from '../../helpers/fill-in';
import DS from 'ember-data';
import { percySnapshot } from 'ember-percy';

module('Integration | Component | add ssh-key', function (hooks) {
  setupRenderingTest(hooks);

  test('it adds an ssh key on submit', async function (assert) {
    assert.expect(6);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    var store = this.owner.lookup('service:store');

    var repo;
    run(function () {
      repo  = store.push({ data: { id: 1, type: 'repo', attributes: { slug: 'travis-ci/travis-web' } } });
    });

    this.set('repo', repo);

    await render(hbs`{{add-ssh-key repo=repo sshKeyAdded="sshKeyAdded"}}`);

    var sshKey = store.peekAll('ssh_key').objectAt(0);

    assert.ok(! sshKey.get('description'), 'description should be blank');
    assert.ok(! sshKey.get('value'), 'value should be blank');
    assert.equal(sshKey.get('id'), 1, 'ssh key id is set to repo id');

    fillIn(this.$('.ssh-description'), 'FOO');
    fillIn(this.$('.ssh-value'), 'bar');

    await click('.form-submit');

    assert.equal(sshKey.get('description'), 'FOO', 'description should be set');
    assert.equal(sshKey.get('value'), 'bar', 'value should be set');
    assert.equal(sshKey.get('id'), 1, 'ssh key id should still be repo id');

    percySnapshot(assert);

    var done = assert.async();
    done();
  });


  test('it throws an error if value for ssh key is blank', async function (assert) {
    assert.expect(5);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    var store = this.owner.lookup('service:store');

    var repo;
    run(function () {
      repo  = store.push({ data: { id: 1, type: 'repo', attributes: { slug: 'travis-ci/travis-web' } } });
    });

    this.set('repo', repo);

    await render(hbs`{{add-ssh-key repo=repo sshKeyAdded="sshKeyAdded"}}`);

    var sshKey = store.peekAll('ssh_key').objectAt(0);

    assert.ok(! sshKey.get('description'), 'description should be blank');
    assert.ok(! sshKey.get('value'), 'value should be blank');
    assert.equal(sshKey.get('id'), 1, 'ssh key id is set to repo id');

    fillIn(this.$('.ssh-description'), 'FOO');
    fillIn(this.$('.ssh-value'), '');

    await click('.form-submit');

    assert.dom('.form-error-message').exists('there is an error message if value is blank');

    percySnapshot(assert);

    fillIn(this.$('.ssh-value'), 'bar');
    await triggerEvent('.ssh-value', 'change');
    assert.dom('.form-error-message').doesNotExist('error message is removed if value is filled in');
  });
});
