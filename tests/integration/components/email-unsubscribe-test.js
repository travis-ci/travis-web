import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import { setupMirage } from 'ember-cli-mirage/test-support';

import {
  EMAIL_UNSUBSCRIBE,
  EMAIL_UNSUBSCRIBE_SADMAIL,
  EMAIL_UNSUBSCRIBE_TITLE,
  EMAIL_UNSUBSCRIBE_DESCRIPTION,
  EMAIL_UNSUBSCRIBE_PRIMARY_BUTTON
} from 'travis/tests/helpers/selectors';

module('Integration | Component | email-unsubscribe', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const repo = this.server.create('repository');
    repo.isCurrentUserACollaborator = true;

    const routerStub = Service.extend({
      currentURL: `http://travis-ci.org/unsubscribe?repository=${repo.id}`
    });

    this.owner.register('service:router', routerStub);

    await render(hbs`{{email-unsubscribe}}`);
  });

  test('it renders', async function (assert) {
    assert.dom(EMAIL_UNSUBSCRIBE).exists();
  });

  test('it has correct structure', async function (assert) {
    assert.dom(EMAIL_UNSUBSCRIBE_SADMAIL).exists();
    assert.dom(EMAIL_UNSUBSCRIBE_TITLE).exists();
    assert.dom(EMAIL_UNSUBSCRIBE_DESCRIPTION).exists();
    assert.dom(EMAIL_UNSUBSCRIBE_PRIMARY_BUTTON).exists();
  });
});
