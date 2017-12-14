import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { percySnapshot } from 'ember-percy';
import { startMirage } from 'travis/initializers/ember-cli-mirage';

moduleForComponent('ssh-key', 'Integration | Component | ssh-key', {
  integration: true,
  beforeEach() {
    this.server = startMirage();
  },

  afterEach() {
    this.server.shutdown();
  }
});

test('it renders the default ssh key if no custom key is set', function (assert) {
  assert.expect(2);

  var key = EmberObject.create({ fingerprint: 'fingerprint' });
  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted"}}`);

  assert.equal(this.$('.ssh-key-name span').text().trim(), 'Default', 'should display that no custom key is set');
  assert.equal(this.$('.ssh-key-value span').text().trim(), 'fingerprint', 'should display default key fingerprint');
  percySnapshot(assert);
});

test('it renders the custom ssh key if custom key is set', function (assert) {
  assert.expect(2);

  var store = getOwner(this).lookup('service:store');

  var key;
  run(function () {
    key = store.push({ data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' } } });
  });

  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted"}}`);

  assert.equal(this.$('.ssh-key-name span').text().trim(), 'fookey', 'should display key description');
  assert.equal(this.$('.ssh-key-value span').text().trim(), 'somethingthing', 'should display custom key fingerprint');
});

test('it deletes a custom key if permissions are right', function (assert) {
  assert.expect(1);

  var store = getOwner(this).lookup('service:store');

  var key;
  run(function () {
    key = store.push({ data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' } } });
  });

  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted" pushAccess=true}}`);
  this.on('sshKeyDeleted', function () {});

  this.$('.ssh-key-action button').click();

  assert.ok(key.get('isDeleted'), 'key should be deleted');
  percySnapshot(assert);

  var done = assert.async();
  done();
});

test('it does not delete the custom key if permissions are insufficient', function (assert) {
  assert.expect(1);

  var store = getOwner(this).lookup('service:store');

  var key;
  run(function () {
    key = store.push({ data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' } } });
  });

  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted" pushAccess=false}}`);

  assert.ok(isEmpty(this.$('.ssh-key-action').find('a')), 'delete link should not be displayed');
});
