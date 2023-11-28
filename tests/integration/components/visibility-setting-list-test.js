import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import {
  INSIGHTS_SETTINGS_LIST_ITEM,
  INSIGHTS_SETTINGS_LIST_ITEM_SELECTED,
  INSIGHTS_SETTINGS_MODAL,
  INSIGHTS_SETTINGS_MODAL_TITLE,
  INSIGHTS_SETTINGS_MODAL_DESCRIPTION,
} from '../../helpers/selectors';
import VisibilitySettingList from "travis/components/visibility-setting-list";

module('Integration | Component | visibility-setting-list', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.setProperties({
      initialKey: 'private',
    });
  });


  test('it is empty when no options are set', async function (assert) {
    this.owner.register('component:visibility-setting-list', VisibilitySettingList.extend({
      options: [{
        key: 'private',
        displayValue: 'you',
        description: 'Do not allow anyone else to see insights from your private builds',
      }, {
        key: 'public',
        displayValue: 'everyone',
        description: 'Allow everyone to see insights from your private builds',
        modalText: 'Allow everyone to see my private build insights',
      }]
    }));
    await render(hbs`{{visibility-setting-list}}`);

    assert.dom(this.element).hasText('');
  });

  test('it is empty when explicitly invisible', async function (assert) {
    this.owner.register('component:visibility-setting-list', VisibilitySettingList.extend({
      isVisible: false,
      options: [{
        key: 'private',
        displayValue: 'you',
        description: 'Do not allow anyone else to see insights from your private builds',
      }, {
        key: 'public',
        displayValue: 'everyone',
        description: 'Allow everyone to see insights from your private builds',
        modalText: 'Allow everyone to see my private build insights',
      }]
    }));

    await render(hbs`{{visibility-setting-list initialKey=this.initialKey}}`);

    assert.dom(this.element).hasText('');
  });

  test('options display', async function (assert) {
    const options = [{
      key: 'private',
      displayValue: 'you',
      description: 'Do not allow anyone else to see insights from your private builds',
    }, {
      key: 'public',
      displayValue: 'everyone',
      description: 'Allow everyone to see insights from your private builds',
      modalText: 'Allow everyone to see my private build insights',
    }];
    this.owner.register('component:visibility-setting-list', VisibilitySettingList.extend({
      options: options
    }));
    const selectedOption = options.find((item) => item.key === this.initialKey);

    await render(hbs`{{visibility-setting-list initialKey=this.initialKey}}`);

    assert.dom(INSIGHTS_SETTINGS_LIST_ITEM).exists({ count: options.length });
    assert.dom(INSIGHTS_SETTINGS_LIST_ITEM_SELECTED).exists({ count: 1 });
    assert.dom(INSIGHTS_SETTINGS_LIST_ITEM_SELECTED).hasText(selectedOption.description);
  });

  test('modal display', async function (assert) {
    this.owner.register('component:visibility-setting-list', VisibilitySettingList.extend({
      options: [{
        key: 'private',
        displayValue: 'you',
        description: 'Do not allow anyone else to see insights from your private builds',
      }, {
        key: 'public',
        displayValue: 'everyone',
        description: 'Allow everyone to see insights from your private builds',
        modalText: 'Allow everyone to see my private build insights',
      }]
    }));
    this.setProperties({
      showModal: true,
      initialKey: 'public',
      selectionKey: 'private',
    });

    await render(hbs`{{visibility-setting-list  initialKey=this.initialKey isShowingConfirmationModal=this.showModal selectionKey=this.selectionKey}}`);

    assert.dom(INSIGHTS_SETTINGS_MODAL).exists();
    assert.dom(INSIGHTS_SETTINGS_MODAL_TITLE).hasText('Restrict visibility of your private build insights');
    assert.dom(INSIGHTS_SETTINGS_MODAL_DESCRIPTION).hasText('This change will make your private build insights only available to you');
  });

  test('modal display with custom modalText', async function (assert) {
    this.owner.register('component:visibility-setting-list', VisibilitySettingList.extend({
      options: [{
        key: 'private',
        displayValue: 'you',
        description: 'Do not allow anyone else to see insights from your private builds',
      }, {
        key: 'public',
        displayValue: 'everyone',
        description: 'Allow everyone to see insights from your private builds',
        modalText: 'Allow everyone to see my private build insights',
      }]
    }));
    this.setProperties({
      showModal: true,
      selectionKey: 'public',
    });

    await render(hbs`{{visibility-setting-list initialKey=this.initialKey isShowingConfirmationModal=this.showModal selectionKey=this.selectionKey}}`);

    assert.dom(INSIGHTS_SETTINGS_MODAL).exists();
    assert.dom(INSIGHTS_SETTINGS_MODAL_TITLE).hasText('Increase visibility of your private build insights');
    assert.dom(INSIGHTS_SETTINGS_MODAL_DESCRIPTION).hasText('Allow everyone to see my private build insights');
  });
});
