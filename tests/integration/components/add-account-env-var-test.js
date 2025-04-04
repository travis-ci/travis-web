import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Integration | Component | add-account-env-var', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders an account-env-var with public value', async function (assert) {
    assert.expect(2);

    const currentUser = this.server.create('user');
    signInUser(currentUser);

    await render(hbs`{{add-account-env-var}}`);

    assert.dom('.env-name').exists('name should be displayed');
    assert.dom('.env-value').exists('value should be visible');
  });

  test('it updates the public flag when toggled', async function (assert) {
    assert.expect(2);

    const currentUser = this.server.create('user');
    signInUser(currentUser);

    await render(hbs`{{add-account-env-var}}`);
    assert.dom('.display-value-switch button').doesNotHaveClass('active', 'public flag should be off by default');

    await click('.display-value-switch button');
    assert.dom('.display-value-switch button').hasClass('active', 'public flag should be on after clicking');
  });

  test('it displays an error if name is blank', async function (assert) {
    assert.expect(1);

    const currentUser = this.server.create('user');
    signInUser(currentUser);

    await render(hbs`{{add-account-env-var}}`);
    await fillIn('.env-value', 'test value');
    await click('.form-submit');

    assert.dom('[data-test-name-error]').containsText('This field is required', 'error message should be for missing name');
  });

  test('it displays an error if value is blank', async function (assert) {
    assert.expect(1);

    const currentUser = this.server.create('user');
    signInUser(currentUser);

    await render(hbs`{{add-account-env-var}}`);
    await fillIn('.env-name', 'TEST_VAR');
    await click('.add-account-env-form-submit');

    assert.dom('[data-test-value-error]').containsText('This field is required', 'error message should be for missing name');
  });
});
