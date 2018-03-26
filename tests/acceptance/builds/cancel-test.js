import $ from 'jquery';
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';

import topPage from 'travis/tests/pages/top';
import getFaviconUri from 'travis/utils/favicon-data-uris';

moduleForAcceptance('Acceptance | builds/cancel', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('cancelling build', function (assert) {
  let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

  let branch = server.create('branch', { repository, name: 'acceptance-tests', default_branch: true });
  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, committer_name: 'Mr T', message: 'This is a message' });
  let build = server.create('build', { number: '5', state: 'started', repository, commit, branch });
  let job = server.create('job', { number: '1234.1', state: 'started', repository, commit, build });

  server.create('log', {
    id: job.id
  });

  buildPage
    .visit({ owner: 'travis-ci', repo: 'travis-web', build_id: build.id })
    .cancelBuild();

  andThen(() => {});
  andThen(function () {
    assert.equal(topPage.flashMessage.text, 'Build has been successfully cancelled.', 'cancelled build notification should be displayed');
    assert.equal($('head link[rel=icon]').attr('href'), getFaviconUri('yellow'), 'expected the favicon data URI to match the one for running');
  });
});
