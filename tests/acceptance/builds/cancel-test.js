import $ from 'jquery';
import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import signInUser from 'travis/tests/helpers/sign-in-user';
import getFaviconUri from 'travis/utils/favicon-data-uris';

module('Acceptance | builds/cancel', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('cancelling build', async function (assert) {
    let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

    let branch = server.create('branch', { repository, name: 'acceptance-tests', default_branch: true });
    let  gitUser = server.create('git-user', { name: 'Mr T' });
    let commit = server.create('commit', { author: gitUser, committer: gitUser, committer_name: 'Mr T', message: 'This is a message' });
    let build = server.create('build', { number: '5', state: 'started', repository, commit, branch });
    let job = server.create('job', { number: '1234.1', state: 'started', repository, commit, build });

    server.create('log', {
      id: job.id
    });

    await visit(`/travis-ci/travis-web/builds/${build.id}`);
    await click('[data-test-repo-actions-cancel-button]');

    assert.dom('[data-test-flash-message-text]').hasText('Build has been successfully cancelled.', 'cancelled build notification should be displayed');
    assert.equal($('head link[rel=icon]').attr('href'), getFaviconUri('yellow'), 'expected the favicon data URI to match the one for running');
  });
});
