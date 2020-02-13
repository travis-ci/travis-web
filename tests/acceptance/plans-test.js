import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';
import plansPage from 'travis/tests/pages/plans';
import { setupMirage } from 'ember-cli-mirage/test-support';

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
    const { intervalSwitch, list, button } = productSection;

    assert.ok(productSection.isPresent);
    assert.ok(intervalSwitch.isPresent);
    assert.ok(list.isPresent);
    assert.equal(list.items.length, 4);
    assert.ok(button.isPresent);
  });

  test('oss section structure', async function (assert) {
    const { ossSection } = plansPage;
    const { button } = ossSection;

    assert.ok(ossSection.isPresent);
    assert.ok(button.isPresent);
  });

  // test('contact section structure', async function (assert) {
  //   const { contactSection } = plansPage;
  //   const { form } = contactSection;
  //   const { name, email, size, phone, message, submit } = form;

  //   assert.ok(contactSection.isPresent);
  //   assert.ok(form.isPresent);
  //   assert.ok(name.isPresent);
  //   assert.ok(email.isPresent);
  //   assert.ok(size.isPresent);
  //   assert.ok(phone.isPresent);
  //   assert.ok(message.isPresent);
  //   assert.ok(submit.isPresent);
  // });

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

  // module('Contact form / lead request', function (hooks) {
  //   const mockData = {
  //     name: 'Test Request',
  //     email: 'test@request.com',
  //     size: 4,
  //     phone: '+1 555-555-5555',
  //     message: 'Test request message.',
  //     referralSource: 'plans-page',
  //   };

  //   hooks.beforeEach(async function () {
  //     this.requestHandler = (request) => JSON.parse(request.requestBody);
  //     this.server.post('/leads', (schema, request) => {
  //       return this.requestHandler(request);
  //     });
  //   });

  //   test('succeeds when all fields filled properly', async function (assert) {
  //     const { form } = plansPage.contactSection;
  //     const { name, email, size, phone, message, submit } = form;

  //     await name.fill(mockData.name);
  //     await email.fill(mockData.email);
  //     await size.fill(mockData.size);
  //     await phone.fill(mockData.phone);
  //     await message.fill(mockData.message);
  //     await submit.click();
  //     await settled();

  //     assert.equal(currentURL(), '/plans/thank-you');
  //     const { thanks } = plansPage;
  //     assert.ok(thanks.isPresent);
  //     assert.ok(thanks.title.isPresent);
  //     assert.ok(thanks.image.isPresent);
  //     assert.ok(thanks.body.isPresent);
  //     assert.ok(thanks.button.isPresent);
  //   });

  //   test('contains all necessary data', async function (assert) {
  //     const { form } = plansPage.contactSection;
  //     const { name, email, size, phone, message, submit } = form;
  //     let data = {};

  //     this.requestHandler = (request) => {
  //       data = JSON.parse(request.requestBody);
  //       return data;
  //     };

  //     await name.fill(mockData.name);
  //     await email.fill(mockData.email);
  //     await size.fill(mockData.size);
  //     await phone.fill(mockData.phone);
  //     await message.fill(mockData.message);
  //     await submit.click();
  //     await settled();

  //     assert.equal(data.name, mockData.name);
  //     assert.equal(data.email, mockData.email);
  //     assert.equal(data.team_size, mockData.size);
  //     assert.equal(data.phone, mockData.phone);
  //     assert.equal(data.message, mockData.message);
  //     assert.equal(data.referral_source, mockData.referralSource);
  //   });

  //   test('doesn\'t get sent if form is invalid', async function (assert) {
  //     const { form } = plansPage.contactSection;
  //     const { submit } = form;
  //     let requestIsSent = false;

  //     this.requestHandler = (request) => {
  //       requestIsSent = true;
  //       return JSON.parse(request.requestBody);
  //     };

  //     await submit.click();
  //     await settled();

  //     assert.equal(requestIsSent, false);

  //     assert.equal(currentURL(), '/plans');
  //     const { thanks } = plansPage;
  //     assert.notOk(thanks.isPresent);
  //     assert.notOk(thanks.title.isPresent);
  //     assert.notOk(thanks.image.isPresent);
  //     assert.notOk(thanks.body.isPresent);
  //     assert.notOk(thanks.button.isPresent);
  //   });
  // });

  // test('thanks page displays', async function (assert) {
  //   await plansPage.visitThanks();
  //   assert.equal(currentURL(), '/plans/thank-you');

  //   const { thanks } = plansPage;
  //   const { title, image, body, button } = thanks;

  //   assert.ok(thanks.isPresent);
  //   assert.ok(title.isPresent);
  //   assert.ok(image.isPresent);
  //   assert.ok(body.isPresent);
  //   assert.ok(button.isPresent);

  //   percySnapshot(assert);
  // });
});
