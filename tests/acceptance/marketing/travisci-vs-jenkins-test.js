import { click, currentURL, fillIn, settled, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';

import {
  SALES_CONTACT_FORM_CONTAINER,
  SALES_CONTACT_FORM_NAME,
  SALES_CONTACT_FORM_EMAIL,
  SALES_CONTACT_FORM_SIZE,
  SALES_CONTACT_FORM_PHONE,
  SALES_CONTACT_FORM_MESSAGE,
  SALES_CONTACT_FORM_SUBMIT,
} from 'travis/tests/helpers/selectors';

// Main page
export const PAGE_URL = '/travisci-vs-jenkins';

export const HEADER_TITLE = '[data-test-tvj-page-header-title]';
export const HEADER_BUTTON = '[data-test-tvj-page-header-button]';
export const HEADER_IMAGE = '[data-test-tvj-page-header-image]';

export const COMPARE_TITLE = '[data-test-tvj-page-compare-title]';
export const COMPARE_ITEM = '[data-test-tvj-page-compare-item]';

export const TRUST_TITLE = '[data-test-tvj-page-trust-title]';
export const TRUST_ITEM = '[data-test-tvj-page-trust-item]';

export const CONTACT_SECTION = '[data-test-tvj-page-contact-section]';
export const CONTACT_TITLE = '[data-test-tvj-page-contact-title]';

export const CONTACT_FORM_CONTAINER = `${CONTACT_SECTION} ${SALES_CONTACT_FORM_CONTAINER}`;
export const CONTACT_FORM_NAME = `${CONTACT_SECTION} ${SALES_CONTACT_FORM_NAME}`;
export const CONTACT_FORM_EMAIL = `${CONTACT_SECTION} ${SALES_CONTACT_FORM_EMAIL}`;
export const CONTACT_FORM_SIZE = `${CONTACT_SECTION} ${SALES_CONTACT_FORM_SIZE}`;
export const CONTACT_FORM_PHONE = `${CONTACT_SECTION} ${SALES_CONTACT_FORM_PHONE}`;
export const CONTACT_FORM_MESSAGE = `${CONTACT_SECTION} ${SALES_CONTACT_FORM_MESSAGE}`;
export const CONTACT_FORM_SUBMIT = `${CONTACT_SECTION} ${SALES_CONTACT_FORM_SUBMIT}`;

export const TESTIMONIAL_TITLE = '[data-test-tvj-page-testimonial-title]';
export const TESTIMONIAL_QUOTE = '[data-test-tvj-page-testimonial-quote]';
export const TESTIMONIAL_NAME = '[data-test-tvj-page-testimonial-name]';
export const TESTIMONIAL_POSITION = '[data-test-tvj-page-testimonial-position]';
export const TESTIMONIAL_LINK = '[data-test-tvj-page-testimonial-link]';

// Thanks page
export const THANKS_URL = '/travisci-vs-jenkins/thank-you';

export const THANKS_CONTAINER = '[data-test-tvj-contact-thanks]';
export const THANKS_TITLE = '[data-test-contact-thanks-title]';
export const THANKS_IMAGE = '[data-test-contact-thanks-image]';
export const THANKS_BODY = '[data-test-contact-thanks-body]';
export const THANKS_BUTTON = '[data-test-contact-thanks-button]';

const checkThanksPageUrlAndContent = (assert, thanksExpected = true) => {
  if (thanksExpected) {
    assert.equal(currentURL(), THANKS_URL);

    assert.dom(THANKS_CONTAINER).exists();
    assert.dom(THANKS_TITLE).exists();
    assert.dom(THANKS_IMAGE).exists();
    assert.dom(THANKS_BODY).exists();
    assert.dom(THANKS_BUTTON).exists();
  } else {
    assert.equal(currentURL(), PAGE_URL);

    assert.dom(THANKS_CONTAINER).doesNotExist();
    assert.dom(THANKS_TITLE).doesNotExist();
    assert.dom(THANKS_IMAGE).doesNotExist();
    assert.dom(THANKS_BODY).doesNotExist();
    assert.dom(THANKS_BUTTON).doesNotExist();
  }
};

module('Acceptance | travis vs jenkins page', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('org redirects', async function (assert) {
    await visit(PAGE_URL);
    assert.equal(currentURL(), '/');
  });


  module('pro version', function (hooks) {
    hooks.beforeEach(async function () {
      enableFeature('pro-version');
      await visit(PAGE_URL);
    });

    test('page structure', async function (assert) {
      assert.equal(currentURL(), PAGE_URL);

      assert.dom(HEADER_TITLE).exists();
      assert.dom(HEADER_BUTTON).exists();
      assert.dom(HEADER_IMAGE).exists();

      assert.dom(COMPARE_TITLE).exists();
      assert.dom(COMPARE_ITEM).exists({ count: 7 });

      assert.dom(TRUST_TITLE).exists();
      assert.dom(TRUST_ITEM).exists({ count: 5 });

      assert.dom(CONTACT_TITLE).exists();
      assert.dom(CONTACT_FORM_CONTAINER).exists();
      assert.dom(CONTACT_FORM_NAME).exists();
      assert.dom(CONTACT_FORM_EMAIL).exists();
      assert.dom(CONTACT_FORM_SIZE).exists();
      assert.dom(CONTACT_FORM_PHONE).exists();
      assert.dom(CONTACT_FORM_MESSAGE).exists();
      assert.dom(CONTACT_FORM_SUBMIT).exists();

      assert.dom(TESTIMONIAL_TITLE).exists();
      assert.dom(TESTIMONIAL_QUOTE).exists();
      assert.dom(TESTIMONIAL_NAME).exists();
      assert.dom(TESTIMONIAL_POSITION).exists();
      assert.dom(TESTIMONIAL_LINK).exists();

      percySnapshot(assert);
    });

    test('thanks page structure', async function (assert) {
      await visit(THANKS_URL);

      checkThanksPageUrlAndContent(assert);

      percySnapshot(assert);
    });

    module('Contact form / lead request', function (hooks) {
      const mockData = {
        name: 'Test Request',
        email: 'test@request.com',
        size: 4,
        phone: '+1 555-555-5555',
        message: 'Test request message.',
        referralSource: 'travisci-vs-jenkins',
      };

      hooks.beforeEach(async function () {
        this.requestHandler = (request) => JSON.parse(request.requestBody);
        this.server.post('/leads', (schema, request) => {
          return this.requestHandler(request);
        });
      });

      test('succeeds when all fields filled properly', async function (assert) {
        let data = {};

        this.requestHandler = (request) => {
          data = JSON.parse(request.requestBody);
          return data;
        };

        await fillIn(CONTACT_FORM_NAME, mockData.name);
        await fillIn(CONTACT_FORM_EMAIL, mockData.email);
        await fillIn(CONTACT_FORM_SIZE, mockData.size);
        await fillIn(CONTACT_FORM_PHONE, mockData.phone);
        await fillIn(CONTACT_FORM_MESSAGE, mockData.message);
        await click(CONTACT_FORM_SUBMIT);
        await settled();

        // Assert data transmission
        assert.equal(data.name, mockData.name);
        assert.equal(data.email, mockData.email);
        assert.equal(data.team_size, mockData.size);
        assert.equal(data.phone, mockData.phone);
        assert.equal(data.message, mockData.message);
        assert.equal(data.referral_source, mockData.referralSource);

        // Assert thanks page URL and content
        checkThanksPageUrlAndContent(assert);
      });

      test('doesn\'t get sent if form is invalid', async function (assert) {
        let requestIsSent = false;

        this.requestHandler = (request) => {
          requestIsSent = true;
          return JSON.parse(request.requestBody);
        };

        await click(CONTACT_FORM_SUBMIT);
        await settled();

        assert.equal(requestIsSent, false);

        // Assert NOT thanks page URL and content
        checkThanksPageUrlAndContent(assert, false);
      });
    });
  });
});
