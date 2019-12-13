import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { fillInWithKeyEvent } from 'travis/tests/helpers/extra-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import DS from 'ember-data';
import { percySnapshot } from 'ember-percy';
import { selectChoose, selectSearch } from 'ember-power-select/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | add env-var', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const repository = this.server.create('repository', {
      name: 'repository-name',
      slug: 'org-login/repository-name',
      private: true
    });

    this.repository = repository;
  });

  test('it adds an env var on submit', async function (assert) {
    assert.expect(7);

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
    assert.equal(envVar.get('branch'), null, 'branch should be empty');
    assert.equal(envVar.get('repo.slug'), 'travis-ci/travis-web', 'repo should be set for the env var');
    assert.ok(!envVar.get('public'), 'env var should be private');

    var done = assert.async();
    done();
  });

  test('it shows an error if no name is present', async function (assert) {
    assert.expect(3);

    await render(hbs`{{add-env-var repo=repo}}`);

    assert.dom('.env-name').doesNotHaveAttribute('value', 'precond: name input should be empty');

    percySnapshot(assert);

    await click('.form-submit');

    assert.dom('.travis-form__error-message').includesText('This field is required', 'the error message should be displayed');

    await fillInWithKeyEvent('.env-name', 'FOO');
    await fillInWithKeyEvent('.env-value', 'bar');
    assert.dom('.travis-form__error-message').doesNotHaveTextContaining('the error message should be removed after value is changed');
  });


  test('it does not show an error when changing the public switch', async function (assert) {
    assert.expect(1);

    await render(hbs`{{add-env-var repo=repo}}`);

    await click('.switch');

    assert.dom('.travis-form__error-message').doesNotHaveTextContaining('there should be no error message');
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

  test('it adds an env var with branch on submit', async function (assert) {
    assert.expect(7);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    var store = this.owner.lookup('service:store');
    assert.equal(store.peekAll('envVar').get('length'), 0, 'precond: store should be empty');

    var repo;
    run(function () {
      repo  = store.push({ data: { id: 1, type: 'repo', attributes: { slug: 'travis-ci/travis-web' } } });
    });

    this.set('repo', repo);

    let branchName = 'foo';

    this.server.create('branch', {
      name: branchName,
      id: `/v3/repo/${this.repository.id}/branch/food`,
      exists_on_github: true,
      repository: this.repository,
    });

    await render(hbs`{{add-env-var repo=repo}}`);

    await fillInWithKeyEvent('.env-name', 'FOO');
    await fillInWithKeyEvent('.env-value', 'bar');

    await selectSearch('.env-branch-selector', branchName);
    await selectChoose('.env-branch-selector', branchName);

    await click('.form-submit');

    assert.equal(store.peekAll('envVar').get('length'), 1, 'env var should be added to store');

    var envVar = store.peekAll('envVar').objectAt(0);

    assert.equal(envVar.get('name'), 'FOO', 'name should be set for the env var');
    assert.equal(envVar.get('value'), 'bar', 'value should be set for the env var');
    assert.equal(envVar.get('branch'), 'foo', 'branch should be set for the env var');
    assert.equal(envVar.get('repo.slug'), 'travis-ci/travis-web', 'repo should be set for the env var');
    assert.ok(!envVar.get('public'), 'env var should be private');

    var done = assert.async();
    done();
  });

  test('it adds two env var with same name & branch on submit', async function (assert) {
    assert.expect(3);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    var store = this.owner.lookup('service:store');
    assert.equal(store.peekAll('envVar').get('length'), 0, 'precond: store should be empty');

    var repo;
    run(function () {
      repo  = store.push({ data: { id: 1, type: 'repo', attributes: { slug: 'travis-ci/travis-web' } } });
    });

    this.set('repo', repo);

    let branchName = 'foo';

    this.server.create('branch', {
      name: branchName,
      id: `/v3/repo/${this.repository.id}/branch/food`,
      exists_on_github: true,
      repository: this.repository,
    });

    await render(hbs`{{add-env-var repo=repo}}`);

    await fillInWithKeyEvent('.env-name', 'FOO');
    await fillInWithKeyEvent('.env-value', 'bar');

    await selectSearch('.env-branch-selector', branchName);
    await selectChoose('.env-branch-selector', branchName);

    await click('.form-submit');

    assert.equal(store.peekAll('envVar').get('length'), 1, 'env var with branch should be added to store');

    await render(hbs`{{add-env-var repo=repo}}`);

    await fillInWithKeyEvent('.env-name', 'FOO');
    await fillInWithKeyEvent('.env-value', 'bar');

    await selectSearch('.env-branch-selector', branchName);
    await selectChoose('.env-branch-selector', branchName);

    await click('.form-submit');

    assert.equal(store.peekAll('envVar').get('length'), 1, 'second env var with same name & branch should not be added to store');

    var done = assert.async();
    done();
  });

  test('it adds two env var with same name (without branch) on submit', async function (assert) {
    assert.expect(3);

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

    await click('.form-submit');

    assert.equal(store.peekAll('envVar').get('length'), 1, 'env var without branch should be added to store');

    await render(hbs`{{add-env-var repo=repo}}`);

    await fillInWithKeyEvent('.env-name', 'FOO');
    await fillInWithKeyEvent('.env-value', 'bar');

    await click('.form-submit');

    assert.equal(store.peekAll('envVar').get('length'), 1, 'second env var with same name (without branch) should not be added to store');

    var done = assert.async();
    done();
  });
});
