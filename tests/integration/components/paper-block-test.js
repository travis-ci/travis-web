import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { MAX_ELEVATION } from 'travis/components/paper-block';

import { PAPER_BLOCK_TITLE } from '../../helpers/selectors';

module('Integration | Component | paper-block', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`
      <PaperBlock>
        template block text
      </PaperBlock>
    `);

    assert.dom(this.element).hasText('template block text');
  });

  test('it shows title', async function (assert) {
    await render(hbs`
      <PaperBlock @title="Title text">
        template block text
      </PaperBlock>
    `);
    assert.dom(PAPER_BLOCK_TITLE).exists();
    assert.dom(PAPER_BLOCK_TITLE).hasText('Title text');
  });

  test('it handles elevation properly', async function (assert) {
    this.set('elevation', 1);
    await render(hbs`<PaperBlock @elevation={{this.elevation}}></PaperBlock>`);

    for (let i = 0; i <= MAX_ELEVATION + 1; i++) {
      this.set('elevation', i);
      assert.dom(this.element.firstChild).hasClass(`elevation-x${i > MAX_ELEVATION ? MAX_ELEVATION : i}`);
    }
  });

  test('it handles padding properly', async function (assert) {
    await render(hbs`<PaperBlock @padding={{this.padding}}></PaperBlock>`);

    assert.dom(this.element.firstChild).hasClass('no-padding');

    this.set('padding', true);
    assert.dom(this.element.firstChild).doesNotHaveClass('no-padding');

    this.set('padding', false);
    assert.dom(this.element.firstChild).hasClass('no-padding');
  });
});
