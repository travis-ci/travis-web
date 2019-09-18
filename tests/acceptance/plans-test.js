import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';
import plansPage from 'travis/tests/pages/plans';

module('Acceptance | plans page', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    enableFeature('pro-version');
    await plansPage.visit();
  });

  test('location and visual test', async function (assert) {
    assert.equal(currentURL(), '/plans');
    percySnapshot(assert);
  });

  test('header section structure', async function (assert) {
    const { headerSection } = plansPage;
    assert.ok(headerSection.isPresent);
  });

  test('product section structure', async function (assert) {
    const { productSection } = plansPage;
    assert.ok(productSection.isPresent);
  });

  test('oss section structure', async function (assert) {
    const { ossSection } = plansPage;
    assert.ok(ossSection.isPresent);
  });

  test('contact section structure', async function (assert) {
    const { contactSection } = plansPage;
    assert.ok(contactSection.isPresent);
  });

  test('enterprise section structure', async function (assert) {
    const { enterpriseSection } = plansPage;
    assert.ok(enterpriseSection.isPresent);
  });

  test('faq section structure', async function (assert) {
    const { faqSection } = plansPage;
    assert.ok(faqSection.isPresent);
  });

  test('message section structure', async function (assert) {
    const { messageSection } = plansPage;
    assert.ok(messageSection.isPresent);
  });
});
