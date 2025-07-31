import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { stubTemplate } from 'travis/tests/helpers/stub-template';

module('Integration | Component | page footer', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.features = this.owner.lookup('service:features');
  });

  test("it doesn't render Imprint, Blog or Twitter links for enterprise", async function (assert) {
    this.features.enable('enterprise-version');
    await render(hbs`{{page-footer}}`);

    assert.dom('[data-test-footer-imprint-link]').doesNotExist();
    assert.dom('[data-test-footer-blog-link]').doesNotExist();
    assert.dom('[data-test-footer-twitter-link]').doesNotExist();
  });

  test("it doesn't show travis-status for enteprise", async function (assert) {
    stubTemplate('components/travis-status', hbs`<div class="status">TRAVIS STATUS</div>`);

    await render(hbs`{{page-footer}}`);

    assert.dom('div.status').hasText(/TRAVIS STATUS/);

    this.features.enable('enterprise-version');
    await render(hbs`{{page-footer}}`);

    assert.dom('div.status').doesNotExist();
  });

  test('it renders licensing information link', async function (assert) {
    await render(hbs`{{page-footer}}`);

    assert.dom().includesText('Licensing information');
    assert.dom('a').exists();
  });
});
