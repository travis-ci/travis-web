import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import DS from 'ember-data';

module('Integration | Component | env-var', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders an env-var with private value', async function(assert) {
    assert.expect(2);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    var store = this.owner.lookup('service:store');
    run(() => {
      var envVar = store.push({ data: { id: 1, type: 'env-var', attributes: { name: 'foo', value: 'bar', public: false } } });
      this.set('envVar', envVar);
    });

    await render(hbs`{{env-var envVar=envVar}}`);

    assert.equal(this.$('.env-var-name').text(), 'foo', 'name should be displayed');
    assert.equal(this.$('.env-var-value input').val(), '••••••••••••••••', 'value should be hidden');
  });

  test('it renders an env-var with public value', async function(assert) {
    assert.expect(2);

    this.owner.register('transform:boolean', DS.BooleanTransform);
    var store = this.owner.lookup('service:store');
    run(() => {
      var envVar = store.push({ data: { id: 1, type: 'env-var', attributes: { name: 'foo', value: 'bar', public: true } } });
      this.set('envVar', envVar);
    });

    await render(hbs`{{env-var envVar=envVar}}`);

    assert.equal(this.$('.env-var-name').text(), 'foo', 'name should be displayed');
    assert.equal(this.$('.env-var-value input').val(), 'bar', 'value should not be hidden');
  });

  // test('it deletes an env-var', function(assert) {
  //   assert.expect(2);

  //   var store = this.container.lookup('service:store');
  //   Ember.run(() => {
  //     var envVar = store.push('envVar', {id: 1, name: 'foo', value: 'bar', public: true});
  //     this.set('envVar', envVar);
  //   });

  //   this.render(hbs`{{env-var envVar=envVar}}`);

  //   assert.equal(store.peekAll('envVar').get('length'), 1, 'precond: store should have an env-var');

  //   this.$('.env-var-action a').click();

  //   assert.equal(store.peekAll('envVar').get('length'), 0, 'env-var should be deleted');

  // });
});