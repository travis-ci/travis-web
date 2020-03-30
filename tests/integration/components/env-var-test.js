import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import DS from 'ember-data';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | env-var', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders an env-var with private value', async function (assert) {
    assert.expect(2);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    var store = this.owner.lookup('service:store');
    run(() => {
      var envVar = store.push({ data: { id: 1, type: 'env-var', attributes: { name: 'foo', value: 'bar', public: false } } });
      this.set('envVar', envVar);
    });

    await render(hbs`{{env-var envVar=envVar}}`);

    assert.dom('.env-var-name').hasText('foo', 'name should be displayed');
    assert.dom('.env-var-value input').hasValue('••••••••••••••••', 'value should be hidden');
  });

  test('it renders an env-var with public value', async function (assert) {
    assert.expect(2);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    var store = this.owner.lookup('service:store');
    run(() => {
      var envVar = store.push({ data: { id: 1, type: 'env-var', attributes: { name: 'foo', value: 'bar', public: true } } });
      this.set('envVar', envVar);
    });

    await render(hbs`{{env-var envVar=envVar}}`);

    assert.dom('.env-var-name').hasText('foo', 'name should be displayed');
    assert.dom('.env-var-value input').hasValue('bar', 'value should not be hidden');
  });

  test('it deletes an env-var', async function (assert) {
    assert.expect(2);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    const store = this.owner.lookup('service:store');
    run(() => {
      const envVar = store.push({ data: { id: 1, type: 'env-var', attributes: { name: 'foo', value: 'bar', public: true } } });
      this.set('envVar', envVar);
    });

    await render(hbs`{{env-var envVar=envVar}}`);

    assert.equal(store.peekAll('envVar').get('length'), 1, 'precond: store should have an env-var');

    await click('.env-var-delete');
    await settled();

    assert.equal(store.peekAll('envVar').get('length'), 0, 'env-var should be deleted');

  });
});
