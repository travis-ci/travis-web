import { isBlank } from '@ember/utils';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import fillIn from '../../helpers/fill-in';
import DS from 'ember-data';
import { percySnapshot } from 'ember-percy';
import { startMirage } from 'travis/initializers/ember-cli-mirage';

module('Integration | Component | add env-var', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.server = startMirage();
  });

  hooks.afterEach(function () {
    this.server.shutdown();
  });

  test('it adds an env var on submit', async function (assert) {
    assert.expect(6);

    var store = this.owner.lookup('service:store');
    assert.equal(store.peekAll('envVar').get('length'), 0, 'precond: store should be empty');

    var repo;
    run(function () {
      repo  = store.push({ data: { id: 1, type: 'repo', attributes: { slug: 'travis-ci/travis-web' } } });
    });

    this.set('repo', repo);

    await render(hbs`{{add-env-var repo=repo}}`);

    fillIn(this.$('.env-name'), 'FOO');
    fillIn(this.$('.env-value'), 'bar');

    this.$('.form-submit').click();

    assert.equal(store.peekAll('envVar').get('length'), 1, 'env var should be added to store');

    var envVar = store.peekAll('envVar').objectAt(0);

    assert.equal(envVar.get('name'), 'FOO', 'name should be set for the env var');
    assert.equal(envVar.get('value'), 'bar', 'value should be set for the env var');
    assert.equal(envVar.get('repo.slug'), 'travis-ci/travis-web', 'repo should be set for the env var');
    assert.ok(!envVar.get('public'), 'env var should be private');

    var done = assert.async();
    done();
  });

  test('it shows an error if no name is present', async function (assert) {
    assert.expect(3);

    await render(hbs`{{add-env-var repo=repo}}`);

    this.$('.env-name').val();
    assert.ok(isBlank(this.$('.env-name').val()), 'precond: name input should be empty');

    this.$('.form-submit').click();

    assert.ok(this.$('.form-error-message').length, 'the error message should be displayed');

    percySnapshot(assert);

    fillIn(this.$('.env-name'), 'FOO');
    fillIn(this.$('.env-value'), 'bar');

    assert.ok(!this.$('.form-error-message').length, 'the error message should be removed after value is changed');
  });

  test('it does not show an error when changing the public switch', async function (assert) {
    assert.expect(1);

    await render(hbs`{{add-env-var repo=repo}}`);

    this.$('.switch-inner').click();

    assert.notOk(this.$('.form-error-message').length, 'there should be no error message');
  });

  test('it adds a public env var on submit', async function (assert) {
    assert.expect(6);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    var store = this.owner.lookup('service:store');
    assert.equal(store.peekAll('envVar').get('length'), 0, 'precond: store should be empty');

    var repo;
    run(function () {
      repo  = store.push({ data: { id: 1, type: 'repo', attributes: { slug: 'travis-ci/travis-web' } } });
    });

    this.set('repo', repo);

    await render(hbs`{{add-env-var repo=repo}}`);

    fillIn(this.$('.env-name'), 'FOO');
    fillIn(this.$('.env-value'), 'bar');

    this.$('.switch').click();

    this.$('.form-submit').click();

    assert.equal(store.peekAll('envVar').get('length'), 1, 'env var should be added to store');

    var envVar = store.peekAll('envVar').objectAt(0);

    assert.equal(envVar.get('name'), 'FOO', 'name should be set for the env var');
    assert.equal(envVar.get('value'), 'bar', 'value should be set for the env var');
    assert.equal(envVar.get('repo.slug'), 'travis-ci/travis-web', 'repo should be set for the env var');
    assert.ok(envVar.get('public'), 'env var should be public');

    var done = assert.async();
    done();
  });
});
