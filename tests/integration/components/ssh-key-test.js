import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ssh-key', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {
      sshKeyDeleted() {},
      sshKeyAdded() {}
    };
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('it renders the default ssh key if no custom key is set', async function (assert) {
    assert.expect(2);

    var key = EmberObject.create({ fingerprint: 'fingerprint' });
    this.set('key', key);
    await render(hbs`{{ssh-key key=key sshKeyDeleted=(action "sshKeyDeleted")}}`);

    assert.dom('.ssh-key-name span').hasText('Default', 'should display that no custom key is set');
    assert.dom('.ssh-key-value span').hasText('fingerprint', 'should display default key fingerprint');
  });

  test('it renders the custom ssh key if custom key is set', async function (assert) {
    assert.expect(2);

    var store = this.owner.lookup('service:store');

    var key;
    run(function () {
      key = store.push({ data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' } } });
    });

    this.set('key', key);
    await render(hbs`{{ssh-key key=key sshKeyDeleted=(action "sshKeyDeleted")}}`);

    assert.dom('.ssh-key-name span').hasText('fookey', 'should display key description');
    assert.dom('.ssh-key-value span').hasText('somethingthing', 'should display custom key fingerprint');
  });

  test('it deletes a custom key if permissions are right', async function (assert) {
    assert.expect(1);

    var store = this.owner.lookup('service:store');

    var key;
    run(function () {
      key = store.push({ data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' } } });
    });

    this.set('key', key);
    await render(hbs`{{ssh-key key=key sshKeyDeleted=(action "sshKeyDeleted") pushAccess=true}}`);

    await click('.ssh-key-action button');

    assert.ok(key.get('isDeleted'), 'key should be deleted');

    var done = assert.async();
    done();
  });

  test('it does not delete the custom key if permissions are insufficient', async function (assert) {
    assert.expect(1);

    var store = this.owner.lookup('service:store');

    var key;
    run(function () {
      key = store.push({ data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' } } });
    });

    this.set('key', key);
    await render(hbs`{{ssh-key key=key sshKeyDeleted=(action "sshKeyDeleted") pushAccess=false}}`);

    assert.dom('.ssh-key-action a').doesNotExist('delete link should not be displayed');
  });
});
