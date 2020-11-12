import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';
import plansPage from 'travis/tests/pages/plans';
import { setupMirage } from 'ember-cli-mirage/test-support';
import config from 'travis/config/environment';

module('Acceptance | plans page', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

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
    const { title, body } = headerSection;

    assert.ok(headerSection.isPresent);
    assert.ok(title.isPresent);
    assert.ok(body.isPresent);
  });

  test('product section structure', async function (assert) {
    const { productSection } = plansPage;
    const { list } = productSection;

    assert.ok(productSection.isPresent);
    assert.ok(list.isPresent);
    assert.equal(list.items.length, 4);
  });

  test('oss section structure', async function (assert) {
    const { ossSection } = plansPage;

    assert.ok(ossSection.isPresent);
  });

  test('contact section structure', async function (assert) {
    const { contactSection } = plansPage;
    const { form } = contactSection;
    const { iframe } = form;

    assert.ok(iframe.isPresent);
    assert.equal(iframe.src, config.urls.pardotHost + config.urls.pardotForm);
  });

  test('enterprise section structure', async function (assert) {
    const { enterpriseSection } = plansPage;
    const { button } = enterpriseSection;

    assert.ok(enterpriseSection.isPresent);
    assert.ok(button.isPresent);
  });

  test('faq section structure', async function (assert) {
    const { faqSection } = plansPage;
    const { list } = faqSection;

    assert.ok(faqSection.isPresent);
    assert.ok(list.isPresent);
    assert.equal(list.items.length, 8);
  });

  test('message section structure', async function (assert) {
    const { messageSection } = plansPage;
    const { button } = messageSection;

    assert.ok(messageSection.isPresent);
    assert.ok(button.isPresent);
  });

  test('thanks page displays', async function (assert) {
    await plansPage.visitThanks();
    assert.equal(currentURL(), '/plans/thank-you');

    const { thanks } = plansPage;
    const { title, image, body, button } = thanks;

    assert.ok(thanks.isPresent);
    assert.ok(title.isPresent);
    assert.ok(image.isPresent);
    assert.ok(body.isPresent);
    assert.ok(button.isPresent);

    percySnapshot(assert);
  });
});
