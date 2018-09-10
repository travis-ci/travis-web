import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { MAX_ELEVATION } from 'travis/components/paper-block';

import { PAPER_BLOCK_TITLE } from '../../helpers/selectors';

module('Integration | Component | paper-block', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`
      {{#paper-block}}
        template block text
      {{/paper-block}}
    `);

    assert.dom(this.element).hasText('template block text');
  });

  test('it shows title', async function (assert) {
    await render(hbs`
      {{#paper-block title="Title text"}}
        template block text
      {{/paper-block}}
    `);
    assert.dom(PAPER_BLOCK_TITLE).exists();
    assert.dom(PAPER_BLOCK_TITLE).hasText('Title text');
  });

  test('it handles elevation properly', async function (assert) {
    this.set('elevation', 1);
    await render(hbs`{{#paper-block elevation=elevation}}{{/paper-block}}`);

    for (let i = 0; i <= MAX_ELEVATION + 1; i++) {
      this.set('elevation', i);
      assert.dom(this.element.firstChild).hasClass(`elevation-x${i > MAX_ELEVATION ? MAX_ELEVATION : i}`);
    }
  });

  test('it handles padding properly', async function (assert) {
    await render(hbs`{{#paper-block padding=padding}}{{/paper-block}}`);

    assert.dom(this.element.firstChild).hasClass('no-padding');

    this.set('padding', true);
    assert.dom(this.element.firstChild).doesNotHaveClass('no-padding');

    this.set('padding', false);
    assert.dom(this.element.firstChild).hasClass('no-padding');
  });
});
