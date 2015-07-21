import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import fillIn from '../../helpers/fill-in';


moduleForComponent('ssh-key', 'Integration | Component | ssh-key', {
  integration: true
});

test('it renders the default ssh key if no custom key is set', function(assert) {
  assert.expect(2);

  var store = this.container.lookup('store:main');

  var key = Ember.Object.create({fingerprint: 'fingerprint'});
  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted"}}`);

  assert.equal(this.$('.ssh-key-name').text().trim(), 'no custom key set', 'should display that no custom key is set');
  assert.equal(this.$('.ssh-key-value').text().trim(), 'fingerprint', 'should display default key fingerprint');

});

test('it renders the custom ssh key if custom key is set', function(assert) {
  assert.expect(2);

  var store = this.container.lookup('store:main');

  var key;
  Ember.run(function() {
    key = store.push('sshKey', {description: 'fookey', fingerprint: 'somethingthing', id: 1});
  });

  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted"}}`);

  assert.equal(this.$('.ssh-key-name').text().trim(), 'fookey', 'should display key description');
  assert.equal(this.$('.ssh-key-value').text().trim(), 'somethingthing', 'should display custom key fingerprint');

});


test('it deletes a custom key', function(assert) {
  assert.expect(1);

  var store = this.container.lookup('store:main');

  var key;
  Ember.run(function() {
    key = store.push('sshKey', {description: 'fookey', fingerprint: 'somethingthing', id: 1});
  });

  this.set('key', key);
  this.render(hbs`{{ssh-key key=key sshKeyDeleted="sshKeyDeleted"}}`);
  this.on('sshKeyDeleted', function() {})

  this.$('.ssh-key-action a').click();

  assert.ok(key.get('isDeleted'), 'key should be deleted')

});
