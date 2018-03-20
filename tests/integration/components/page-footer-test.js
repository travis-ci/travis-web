import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { stubTemplate } from 'travis/tests/helpers/stub-template';

module('Integration | Component | page footer', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.features = this.owner.lookup('service:features');
  });

  test("it doesn't render Imprint, Blog or Twitter links for enterprise", async function(assert) {
    this.features.enable('enterprise-version');
    await render(hbs`{{page-footer}}`);

    assert.equal(this.$('a:contains(Imprint)').length, 0);
    assert.equal(this.$('a:contains(Blog)').length, 0);
    assert.equal(this.$('a:contains(Twitter)').length, 0);
  });

  test("it doesn't show travis-status for enteprise", async function(assert) {
    stubTemplate('components/travis-status', hbs`TRAVIS STATUS`);

    await render(hbs`{{page-footer}}`);

    assert.ok(this.$().text().match(/TRAVIS STATUS/));

    this.features.enable('enterprise-version');
    await render(hbs`{{page-footer}}`);

    assert.notOk(this.$().text().match(/TRAVIS STATUS/));
  });

  test('it shows security statement for pro version', async function(assert) {
    await render(hbs`{{page-footer}}`);

    assert.equal(this.$('a:contains(Security)').length, 0);

    this.features.enable('pro-version');
    await render(hbs`{{page-footer}}`);

    assert.equal(this.$('a:contains(Security)').length, 1);
  });
});
