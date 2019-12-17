import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { percySnapshot } from 'ember-percy';

import {
  create,
  text,
  visitable
} from 'ember-cli-page-object';

const tvgPageUrl = '/travisci-vs-jenkins';

const tvjPage = create({
  visit: visitable(tvgPageUrl),

  headerSection: {
    scope: '[data-test-tvj-page-header-section]',

    title: {
      scope: '[data-test-tvj-page-header-title]',
      text: text()
    },

    button: {
      scope: '[data-test-tvj-page-header-button]',
      text: text(),
    },

    image: {
      scope: '[data-test-tvj-page-header-image]',
    },
  },
});

module('Acceptance | travis vs jenkins page', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    await tvjPage.visit();
  });

  test('page structure', async function (assert) {
    assert.equal(currentURL(), tvgPageUrl);

    const { headerSection } = tvjPage;
    const { title, button, image } = headerSection;

    assert.ok(headerSection.isPresent);
    assert.ok(title.isPresent);
    assert.ok(button.isPresent);
    assert.ok(image.isPresent);

    percySnapshot(assert);
  });
});
