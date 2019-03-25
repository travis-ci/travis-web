import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | repository-migration-modal', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('repositories', [{ slug: 'travis-ci/travis-web' }]);
    this.set('fakeAction', () => {});
    await render(hbs`{{repository-migration-modal repositories=repositories onClose=fakeAction}}`);

    const expectedHeader = 'Migrate selected repositories?';
    assert.dom('[data-test-repository-migration-modal-header]').hasText(expectedHeader);

    // Only asserting text on those paragraphs that have interpolated content that we
    // want to be sure have the right value.
    const expectedFirstParagraph =
      `Please confirm that you would like to migrate the
      listed repositories from travis-ci.org to travis-ci.com:`.trim();
    assert.dom('[data-test-repository-migration-modal-text-first]').hasText(expectedFirstParagraph);

    assert.dom('[data-test-repository-migration-modal-text-second]').exists();

    const expectedThirdParagraph =
      `Please note that your build history will not be migrated.
      This will be available shortly. Until then you can access
      the history on travis-ci.org.`.trim();
    assert.dom('[data-test-repository-migration-modal-text-third]').hasText(expectedThirdParagraph);

    const expectedBuildHistoryLink = 'https://travis-ci.org';

    assert.dom('[data-test-repository-migration-modal-org-build-history-link]').hasAttribute('href', expectedBuildHistoryLink);

    const expectedSupportMailToLInk = 'mailto:support@travis-ci.com';
    assert.dom('[data-test-repository-migration-modal-support-mailto-link]').hasAttribute('href', expectedSupportMailToLInk);
  });
});
