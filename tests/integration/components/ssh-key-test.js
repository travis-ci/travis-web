import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import fillIn from '../../helpers/fill-in';

moduleForComponent('ssh-key', 'Integration | Component | ssh-key', {
  integration: true
});

test('it renders the default ssh key if no custom key is set', function(assert) {
  assert.expect(2);

  var store = Ember.getOwner(this).lookup('service:store');

  var key = Ember.Object.create({fingerprint: 'fingerprint'});
  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted"}}`);

  assert.equal(this.$('.ssh-key-name').text().trim(), 'no custom key set', 'should display that no custom key is set');
  assert.equal(this.$('.ssh-key-value').text().trim(), 'fingerprint', 'should display default key fingerprint');

});

test('it renders the custom ssh key if custom key is set', function(assert) {
  assert.expect(2);

  var store = Ember.getOwner(this).lookup('service:store');

  var key;
  Ember.run(function() {
    key = store.push({data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' }}});
  });

  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted"}}`);

  assert.equal(this.$('.ssh-key-name').text().trim(), 'fookey', 'should display key description');
  assert.equal(this.$('.ssh-key-value').text().trim(), 'somethingthing', 'should display custom key fingerprint');

});


test('it deletes a custom key if permissions are right', function(assert) {
  assert.expect(1);

  var store = Ember.getOwner(this).lookup('service:store');

  var key;
  Ember.run(function() {
    key = store.push({data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' }}});
  });

  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted" pushAccess=true}}`);
  this.on('sshKeyDeleted', function() {});

  this.$('.ssh-key-action a').click();

  assert.ok(key.get('isDeleted'), 'key should be deleted');

  // we don't deal with saving records for now, so at least wait till it's done
  var done = assert.async();
  setTimeout(function() { done(); }, 500);
});

test('it does not delete the custom key if permissions are insufficient', function(assert) {
  assert.expect(1);

  var store = Ember.getOwner(this).lookup('service:store');

  var key;
  Ember.run(function() {
    key = store.push({data: { id: 1, type: 'ssh-key', attributes: { description: 'fookey', fingerprint: 'somethingthing' }}});
  });

  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted" pushAccess=false}}`);

  assert.ok(Ember.isEmpty(this.$('.ssh-key-action').find('a')), 'delete link should not be displayed');

});
