import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import getFaviconUri from 'travis/utils/favicon-data-uris';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | builds/cancel', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    signInUser(currentUser);
  });

  test('cancelling build', async function (assert) {
    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1} });

    let branch = this.server.create('branch', { repository, name: 'acceptance-tests', default_branch: true });
    let gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, committer_name: 'Mr T', message: 'This is a message' });
    let build = this.server.create('build', { number: '5', state: 'started', repository, commit, branch });
    let job = this.server.create('job', { number: '1234.1', state: 'started', repository, commit, build });

    this.server.create('log', {
      id: job.id
    });

    await visit(`/travis-ci/travis-web/builds/${build.id}`);
    await click('[data-test-repo-actions-cancel-button]');

    assert.dom('[data-test-flash-message-text]').hasText('Build has been successfully cancelled.', 'cancelled build notification should be displayed');
    // Ember-test-helpers find does not work here
    const iconHref = window.document.querySelector('head link[rel=icon]').getAttribute('href');
    assert.equal(iconHref, getFaviconUri('yellow'), 'expected the favicon data URI to match the one for running');
  });
});
