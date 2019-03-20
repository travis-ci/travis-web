import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | visibility-setting-list', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('options', [{
      value: 'private',
      displayValue: 'you',
      description: 'Do not allow anyone else to see insights from your private builds',
    }, {
      value: 'public',
      displayValue: 'everyone',
      description: 'Allow everyone to see insights from your private builds',
      modalText: 'Allow everyone to see my private build insights',
    }]);

    this.setProperties({
      selected: 'private',
    });
  });


  test('it is empty when no options are set', async function (assert) {
    await render(hbs`{{visibility-setting-list}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('it is empty when explicitly invisible', async function (assert) {
    this.set('isVisible', false);
    await render(hbs`{{visibility-setting-list options=options selected=selected isVisible=isVisible}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('options display', async function (assert) {
    const selectedIndex = this.options.findIndex((el) => el.value === this.selected);
    const selectedOption = this.options[selectedIndex];

    await render(hbs`{{visibility-setting-list options=options selected=selected}}`);

    assert.dom('[data-test-visibility-settings-list-item]').exists({ count: this.options.length });
    assert.dom('.visibility-setting-list-item--selected').exists({ count: 1 });
    assert.dom('.visibility-setting-list-item--selected').hasText(selectedOption.description);
  });

  test('modal display', async function (assert) {
    this.setProperties({
      showModal: true,
      selected: 'public',
      currentSelection: 'private',
    });

    await render(hbs`{{visibility-setting-list options=options selected=selected isShowingConfirmationModal=showModal currentSelection=currentSelection}}`);

    assert.dom('.visibility-settings-modal').exists();
    assert.dom('.visibility-settings-modal__header').hasText('Restrict visibility of your private build insights');
    assert.dom('.visibility-settings-modal__body').hasText('This change will make your private build insights only available to you');
  });

  test('modal display with custom modalText', async function (assert) {
    this.setProperties({
      showModal: true,
      currentSelection: 'public',
    });

    await render(hbs`{{visibility-setting-list options=options selected=selected isShowingConfirmationModal=showModal currentSelection=currentSelection}}`);

    assert.dom('.visibility-settings-modal').exists();
    assert.dom('.visibility-settings-modal__header').hasText('Increase visibility of your private build insights');
    assert.dom('.visibility-settings-modal__body').hasText('Allow everyone to see my private build insights');
  });
});
