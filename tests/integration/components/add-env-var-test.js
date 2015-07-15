import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('add-env-var', 'Integration | Component | add env-var', {
  integration: true
});

test('it adds an env var on submit', function(assert) {
  assert.expect(5);

  var store = this.container.lookup('store:main');
  assert.equal(store.all('envVar').get('length'), 0, 'precond: store should be empty');

  var repo;
  Ember.run(function() {
    repo  = store.push('repo', {id: 1, slug: 'travis-ci/travis-web'});
  });

  this.set('repo', repo);

  this.render(hbs`{{add-env-var repo=repo}}`);

  this.$('.env-name').val('FOO');
  var e = jQuery.Event("keyup");
  e.which = 50;
  this.$('.env-name').trigger(e);

  this.$('.env-value').val('bar');
  var e = jQuery.Event("keyup");
  e.which = 50;
  this.$('.env-value').trigger(e);

  this.$('.form-submit').click();

  assert.equal(store.all('envVar').get('length'), 1, 'env var should be added to store');

  var envVar = store.all('envVar').objectAt(0);

  assert.equal(envVar.get('name'), 'FOO', 'name should be set for the env var');
  assert.equal(envVar.get('value'), 'bar', 'value should be set for the env var');
  assert.equal(envVar.get('repo.slug'), 'travis-ci/travis-web', 'repo should be set for the env var');
});

test('it shows an error if no name is present', function(assert) {
  assert.expect(3);

  this.render(hbs`{{add-env-var repo=repo}}`);

  this.$('.env-name').val();
  assert.ok(Ember.isBlank(this.$('.env-name').val()), 'precond: name input should be empty');

  this.$('.form-submit').click();

  assert.ok(this.$('.form-error').length, 'the error message should be displayed');

  var e = jQuery.Event("keypress");
  e.which = 50;
  this.$('.env-name').trigger(e);

  assert.ok(!this.$('.form-error').length, 'the error message should be removed after value is changed');
});