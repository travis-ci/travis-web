import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { percySnapshot } from 'ember-percy';
import { setupMirage } from 'ember-cli-mirage/test-support';

import {
  create,
  text,
  visitable
} from 'ember-cli-page-object';

const tvjPageUrl = '/travisci-vs-jenkins';

const tvjPage = create({
  visit: visitable(tvjPageUrl),

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
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    await tvjPage.visit();
  });

  test('page structure', async function (assert) {
    assert.equal(currentURL(), tvjPageUrl);

    const { headerSection } = tvjPage;
    const { title, button, image } = headerSection;

    assert.ok(headerSection.isPresent);
    assert.ok(title.isPresent);
    assert.ok(button.isPresent);
    assert.ok(image.isPresent);

    percySnapshot(assert);
  });
});
