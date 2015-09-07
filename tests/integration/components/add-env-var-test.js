import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import fillIn from '../../helpers/fill-in';


moduleForComponent('add-env-var', 'Integration | Component | add env-var', {
  integration: true
});

test('it adds an env var on submit', function(assert) {
  assert.expect(6);

  var store = this.container.lookup('store:main');
  assert.equal(store.all('envVar').get('length'), 0, 'precond: store should be empty');

  var repo;
  Ember.run(function() {
    repo  = store.push('repo', {id: 1, slug: 'travis-ci/travis-web'});
  });

  this.set('repo', repo);

  this.render(hbs`{{add-env-var repo=repo}}`);

  fillIn(this.$('.env-name'), 'FOO');
  fillIn(this.$('.env-value'), 'bar');

  this.$('.form-submit').click();

  assert.equal(store.all('envVar').get('length'), 1, 'env var should be added to store');

  var envVar = store.all('envVar').objectAt(0);

  assert.equal(envVar.get('name'), 'FOO', 'name should be set for the env var');
  assert.equal(envVar.get('value'), 'bar', 'value should be set for the env var');
  assert.equal(envVar.get('repo.slug'), 'travis-ci/travis-web', 'repo should be set for the env var');
  assert.ok(!envVar.get('public'), 'env var should be private');

  var done = assert.async();
  setTimeout(function() { done(); }, 500);
});

test('it shows an error if no name is present', function(assert) {
  assert.expect(3);

  this.render(hbs`{{add-env-var repo=repo}}`);

  this.$('.env-name').val();
  assert.ok(Ember.isBlank(this.$('.env-name').val()), 'precond: name input should be empty');

  this.$('.form-submit').click();

  assert.ok(this.$('.form-error-message').length, 'the error message should be displayed');

  fillIn(this.$('.env-name'), 'FOO');
  fillIn(this.$('.env-value'), 'bar');

  assert.ok(!this.$('.form-error-message').length, 'the error message should be removed after value is changed');
});

test('it adds a public env var on submit', function(assert) {
  assert.expect(6);

  var store = this.container.lookup('store:main');
  assert.equal(store.all('envVar').get('length'), 0, 'precond: store should be empty');

  var repo;
  Ember.run(function() {
    repo  = store.push('repo', {id: 1, slug: 'travis-ci/travis-web'});
  });

  this.set('repo', repo);

  this.render(hbs`{{add-env-var repo=repo}}`);

  fillIn(this.$('.env-name'), 'FOO');
  fillIn(this.$('.env-value'), 'bar');

  this.$('.switch').click();

  this.$('.form-submit').click();

  assert.equal(store.all('envVar').get('length'), 1, 'env var should be added to store');

  var envVar = store.all('envVar').objectAt(0);

  assert.equal(envVar.get('name'), 'FOO', 'name should be set for the env var');
  assert.equal(envVar.get('value'), 'bar', 'value should be set for the env var');
  assert.equal(envVar.get('repo.slug'), 'travis-ci/travis-web', 'repo should be set for the env var');
  assert.ok(envVar.get('public'), 'env var should be public');

  var done = assert.async();
  setTimeout(function() { done(); }, 500);
});
