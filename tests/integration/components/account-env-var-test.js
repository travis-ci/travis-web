import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render  } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import EmberObject from '@ember/object';

module('Integration | Component | account-env-var', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders an account-env-var with public value', async function (assert) {
    assert.expect(2);

    const envVar = EmberObject.create({
      name: 'TEST_VAR',
      value: 'TEST',
      public: true
    });
    this.set('envVar', envVar);

    await render(hbs`{{account-env-var envVar=this.envVar}}`);

    assert.dom('.env-var-name').hasText(envVar['name'], 'name should be displayed');
    assert.dom('.env-var-value input').hasValue(envVar['value'], 'value should be visible');
  });

  test('it renders an account-env-var with private value', async function (assert) {
    assert.expect(2);

    const envVar = EmberObject.create({
      name: 'TEST_VAR',
      value: 'TEST',
      public: false
    });
    this.set('envVar', envVar);

    await render(hbs`{{account-env-var envVar=this.envVar}}`);

    assert.dom('.env-var-name').hasText(envVar['name'], 'name should be displayed');
    assert.dom('.env-var-value input').hasValue('••••••••••••••••', 'value should be hidden');
  });
});
