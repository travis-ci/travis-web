import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { percySnapshot } from 'ember-percy';
import { startMirage } from 'travis/initializers/ember-cli-mirage';

module('Integration | Component | ssh-key', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function() {
    this.server = startMirage();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('it renders the default ssh key if no custom key is set', async function(assert) {
    assert.expect(2);

    var key = EmberObject.create({ fingerprint: 'fingerprint' });
    this.set('key', key);
    await render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted"}}`);

    assert.equal(this.$('.ssh-key-name span').text().trim(), 'Default', 'should display that no custom key is set');
    assert.equal(this.$('.ssh-key-value span').text().trim(), 'fingerprint', 'should display default key fingerprint');
    percySnapshot(assert);
  });

  test('it renders the custom ssh key if custom key is set', async function(assert) {
    assert.expect(2);

    var store = this.owner.lookup('service:store');

    var key;
    run(function () {
      key = store.push({ data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' } } });
    });

    this.set('key', key);
    await render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted"}}`);

    assert.equal(this.$('.ssh-key-name span').text().trim(), 'fookey', 'should display key description');
    assert.equal(this.$('.ssh-key-value span').text().trim(), 'somethingthing', 'should display custom key fingerprint');
  });

  test('it deletes a custom key if permissions are right', async function(assert) {
    assert.expect(1);

    var store = this.owner.lookup('service:store');

    var key;
    run(function () {
      key = store.push({ data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' } } });
    });

    this.set('key', key);
    await render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted" pushAccess=true}}`);
    this.actions.sshKeyDeleted = function () {};

    this.$('.ssh-key-action button').click();

    assert.ok(key.get('isDeleted'), 'key should be deleted');
    percySnapshot(assert);

    var done = assert.async();
    done();
  });

  test('it does not delete the custom key if permissions are insufficient', async function(assert) {
    assert.expect(1);

    var store = this.owner.lookup('service:store');

    var key;
    run(function () {
      key = store.push({ data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' } } });
    });

    this.set('key', key);
    await render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted" pushAccess=false}}`);

    assert.ok(isEmpty(this.$('.ssh-key-action').find('a')), 'delete link should not be displayed');
  });
});