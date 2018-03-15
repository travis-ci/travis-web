import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

import requestsPage from 'travis/tests/pages/requests';

moduleForAcceptance('Acceptance | repo | requests', {
  beforeEach() {
    this.repo = server.create('repository', { slug: 'travis-ci/travis-web' });
  }
});

test('list requests', function (assert) {
  let approvedRequest = this.repo.createRequest({
    result: 'approved',
    message: 'A request message',
    created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365),
    event_type: 'pull_request'
  });

  let approvedCommit = server.create('commit', {
    branch: 'acceptance-tests',
    message: 'A commit message',
    request: approvedRequest
  });

  server.create('build', {
    repository: this.repo,
    state: 'passed',
    commit_id: approvedCommit.id,
    commit: approvedCommit,
    request: approvedRequest,
    number: '1919'
  });

  this.repo.createRequest({
    result: 'rejected',
    event_type: 'cron'
  });

  this.repo.createRequest({
    result: 'pending',
    event_type: 'api'
  });

  requestsPage.visit({organization: 'travis-ci', repo: 'travis-web', requestId: approvedRequest.id});

  andThen(function () {
    requestsPage.requests[0].as(request => {
      assert.ok(request.isApproved);
      assert.ok(request.isHighlighted, 'expected the request to be highlighted because of the query param');

      assert.equal(request.commitLink.text, 'abc123');
      assert.equal(request.commitMessage.text, 'A commit message');

      assert.equal(request.createdAt.text, 'about a year ago');

      assert.equal(request.buildNumber.text, '1919');
      assert.equal(request.requestMessage.text, 'A request message');
    });

    requestsPage.requests[1].as(request => {
      assert.ok(request.isRejected);
      assert.notOk(request.isHighlighted);

      assert.ok(request.commitLink.isHidden);
      assert.ok(request.commitMissing.text, 'missing');
      assert.ok(request.buildNumber.isHidden);
      assert.equal(request.requestMessage.text, 'Build created successfully');
    });

    requestsPage.requests[2].as(request => {
      assert.ok(request.isPending);
    });

    assert.ok(requestsPage.missingNotice.isHidden);
  });

  percySnapshot(assert);
});

test('a placeholder shows when there are no requests', function (assert) {
  requestsPage.visit({organization: 'travis-ci', repo: 'travis-web'});

  andThen(() => {
    assert.equal(requestsPage.requests.length, 0);
    assert.ok(requestsPage.missingNotice.isVisible);
  });
});
