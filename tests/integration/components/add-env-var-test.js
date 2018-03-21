import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { fillInWithKeyEvent } from 'travis/tests/helpers/extra-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import DS from 'ember-data';
import { percySnapshot } from 'ember-percy';

module('Integration | Component | add env-var', function (hooks) {
  setupRenderingTest(hooks);

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

    await fillInWithKeyEvent('.env-name', 'FOO');
    await fillInWithKeyEvent('.env-value', 'bar');

    await click('.form-submit');

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

    assert.dom('.env-name').doesNotHaveAttribute('value', 'precond: name input should be empty');

    await click('.form-submit');

    assert.dom('.form-error-message').exists('the error message should be displayed');

    percySnapshot(assert);

    await fillInWithKeyEvent('.env-name', 'FOO');
    await fillInWithKeyEvent('.env-value', 'bar');

    assert.dom('.form-error-message').doesNotExist('the error message should be removed after value is changed');
  });

  test('it does not show an error when changing the public switch', async function (assert) {
    assert.expect(1);

    await render(hbs`{{add-env-var repo=repo}}`);

    await click('.switch-inner');

    assert.dom('.form-error-message').doesNotExist('there should be no error message');
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

    await fillInWithKeyEvent('.env-name', 'FOO');
    await fillInWithKeyEvent('.env-value', 'bar');

    await click('.switch');

    await click('.form-submit');

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
