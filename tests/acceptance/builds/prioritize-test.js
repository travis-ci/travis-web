import { module, test } from 'qunit';
import { visit, click, triggerKeyEvent } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | builds/prioritize', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user');
    signInUser(currentUser);
  });

  test('prioritizing build', async function (assert) {
    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web' });
    let branch = this.server.create('branch', { repository, name: 'acceptance-tests', default_branch: true });
    let gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, committer_name: 'Mr T', message: 'This is a message' });
    let build = this.server.create('build', { number: '5', state: 'queued', permissions: { 'prioritize': true }, repository, commit, branch, priority: true, });
    let job = this.server.create('job', { number: '1234.1', state: 'queued', repository, commit, build });
    this.server.create('log', { id: job.id });

    await visit('/travis-ci/travis-web');
    assert.dom('.action-button-container').exists();
    await click('.action-button--prioritize');
    assert.dom('.repo-actions-modal__header').hasText('Prioritize your build');
    assert.dom('.travis-form__field-checkbox--checked').exists({ count: 1 });
    assert.dom('.travis-form__field-checkbox--checked').hasText('Place build at the top of the queue');
    assert.dom('.travis-form__field-checkbox--unchecked').exists({ count: 1 });
    assert.dom('.travis-form__field-checkbox--unchecked').hasText('Place build at the top of the queue and cancel all running jobs');

    // Checking the Cancel button.
    assert.dom('.button--red').hasText('Cancel');
    await click('.button--red');
    assert.dom('.repo-actions-modal__header').doesNotExist();

    // Checking the Close button.
    await click('.action-button--prioritize');
    assert.dom('.repo-actions-modal__header').hasText('Prioritize your build');
    assert.dom('.repo-actions-modal__close-button').exists();
    await click('.repo-actions-modal__close-button');
    assert.dom('.repo-actions-modal__header').doesNotExist();

    // Checking the Esc Button Event functionality.
    await click('.action-button--prioritize');
    await triggerKeyEvent('button', 'keydown', 'Escape');
    assert.dom('.repo-actions-modal__header').doesNotExist();

    // Checking the Prioritize build button check.
    await click('.action-button--prioritize');
    assert.dom('.button--blue').hasText('Prioritize build');
    await click('.button--blue');
    assert.dom('[data-test-components-flash-item]').exists();
  });
});
