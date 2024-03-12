import { run } from '@ember/runloop';
import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  fillIn,
  triggerEvent,
  waitFor
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import DS from 'ember-data';

module('Integration | Component | add ssh-key', function (hooks) {
  setupRenderingTest(hooks);

  skip('it adds an ssh key on submit', async function (assert) {
    this.owner.register('transform:boolean', DS.BooleanTransform);
    let store = this.owner.lookup('service:store');

    let repo;
    run(function () {
      repo  = store.push({ data: { id: 1, type: 'repo', attributes: { slug: 'travis-ci/travis-web' } } });
    });

    this.set('repo', repo);

    await render(hbs`{{add-ssh-key repo=this.repo sshKeyAdded="sshKeyAdded"}}`);

    let sshKey = store.peekAll('ssh_key').objectAt(0);

    assert.ok(! sshKey.get('description'), 'description should be blank');
    assert.ok(! sshKey.get('value'), 'value should be blank');
    assert.equal(sshKey.get('id'), 1, 'ssh key id is set to repo id');

    fillIn('.ssh-description', 'FOO');
    fillIn('.ssh-value', 'bar');

    await waitFor('.form-footer .form-submit', {timeout: 2000});
    await click('.form-submit');

    assert.equal(sshKey.get('description'), 'FOO', 'description should be set');
    assert.equal(sshKey.get('value'), 'bar', 'value should be set');
    assert.equal(sshKey.get('id'), 1, 'ssh key id should still be repo id');
  });


  skip('it throws an error if value for ssh key is blank', async function (assert) {
    assert.expect(5);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    let store = this.owner.lookup('service:store');

    let repo;
    run(function () {
      repo  = store.push({ data: { id: 1, type: 'repo', attributes: { slug: 'travis-ci/travis-web' } } });
    });

    this.set('repo', repo);

    await render(hbs`{{add-ssh-key repo=this.repo sshKeyAdded="sshKeyAdded"}}`);

    let sshKey = store.peekAll('ssh_key').objectAt(0);

    assert.ok(! sshKey.get('description'), 'description should be blank');
    assert.ok(! sshKey.get('value'), 'value should be blank');
    assert.equal(sshKey.get('id'), 1, 'ssh key id is set to repo id');

    fillIn('.ssh-description', 'FOO');
    fillIn('.ssh-value', '');

    await click('.form-submit');

    assert.dom('.form-error-message').exists('there is an error message if value is blank');

    fillIn('.ssh-value', 'bar');
    await triggerEvent('.ssh-value', 'change');
    assert.dom('.form-error-message').doesNotExist('error message is removed if value is filled in');
  });
});
