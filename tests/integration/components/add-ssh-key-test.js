import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import fillIn from '../../helpers/fill-in';


moduleForComponent('add-ssh-key', 'Integration | Component | add ssh-key', {
  integration: true
});

test('it adds an ssh key on submit', function(assert) {
  assert.expect(6);

  var store = this.container.lookup('store:main');

  var repo;
  Ember.run(function() {
    repo  = store.push('repo', {id: 1, slug: 'travis-ci/travis-web'});
  });

  this.set('repo', repo);

  this.render(hbs`{{add-ssh-key repo=repo sshKeyAdded="sshKeyAdded"}}`);

  var sshKey = store.all('ssh_key').objectAt(0);

  assert.ok(! sshKey.get('description'), 'description should be blank');
  assert.ok(! sshKey.get('value'), 'value should be blank');
  assert.equal(sshKey.get('id'), 1, 'ssh key id is set to repo id');

  fillIn(this.$('.ssh-description'), 'FOO');
  fillIn(this.$('.ssh-value'), 'bar');

  this.$('.form-submit').click();

  assert.equal(sshKey.get('description'), 'FOO', 'description should be set');
  assert.equal(sshKey.get('value'), 'bar', 'value should be set');
  assert.equal(sshKey.get('id'), 1, 'ssh key id should still be repo id');

  var done = assert.async();
  setTimeout(function() { done(); }, 500);
});


test('it throws an error if value for ssh key is blank', function(assert) {
  assert.expect(5);

  var store = this.container.lookup('store:main');

  var repo;
  Ember.run(function() {
    repo  = store.push('repo', {id: 1, slug: 'travis-ci/travis-web'});
  });

  this.set('repo', repo);

  this.render(hbs`{{add-ssh-key repo=repo sshKeyAdded="sshKeyAdded"}}`);

  var sshKey = store.all('ssh_key').objectAt(0);

  assert.ok(! sshKey.get('description'), 'description should be blank');
  assert.ok(! sshKey.get('value'), 'value should be blank');
  assert.equal(sshKey.get('id'), 1, 'ssh key id is set to repo id');

  fillIn(this.$('.ssh-description'), 'FOO');
  fillIn(this.$('.ssh-value'), '');

  this.$('.form-submit').click();

  assert.ok(this.$('.form-error-message').length, 'there is an error message if value is blank');

  fillIn(this.$('.ssh-value'), 'bar');
  assert.ok(!this.$('.form-error-message').length, 'error message is removed if value is filled in');

});
