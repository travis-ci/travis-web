import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

import requestsPage from 'travis/tests/pages/requests';

moduleForAcceptance('Acceptance | repo | requests');

test('list requests', function (assert) {
  let repo = server.create('repository', { slug: 'travis-ci/travis-web' });

  let approvedRequest = repo.createRequest({
    result: 'approved',
    message: 'A request message'
  });

  let approvedCommit = server.create('commit', {
    branch: 'acceptance-tests',
    message: 'A commit message',
    request: approvedRequest
  });

  let approvedBuild = server.create('build', {
    repository: repo,
    state: 'passed',
    commit_id: approvedCommit.id,
    commit: approvedCommit,
    request: approvedRequest,
    number: '1919'
  });

  approvedRequest.save();

  repo.createRequest({
    result: 'rejected'
  });

  repo.createRequest({
    result: 'pending'
  });

  repo.save();

  requestsPage.visit({organization: 'travis-ci', repo: 'travis-web'});

  andThen(function () {
    pauseTest();
    requestsPage.requests[0].as(request => {
      assert.ok(request.isApproved);
      assert.equal(request.commitLink.text, 'abc123');
      assert.equal(request.commitMessage.text, 'A commit message');
      assert.equal(request.buildNumber.text, '1919');
      assert.equal(request.requestMessage.text, 'A request message');
    });

    requestsPage.requests[1].as(request => {
      assert.ok(request.isRejected);
      assert.ok(request.commitLink.isHidden);
      assert.ok(request.commitMissing.text, 'missing');
      assert.ok(request.buildNumber.isHidden);
      assert.equal(request.requestMessage.text, 'Build created successfully');
    });

    requestsPage.requests[2].as(request => {
      assert.ok(request.isPending);
    });
  });

  percySnapshot(assert);
});
