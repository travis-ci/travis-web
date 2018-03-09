import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

import requestsPage from 'travis/tests/pages/requests';

moduleForAcceptance('Acceptance | repo | requests');

test('list requests', function (assert) {
  let repo = server.create('repository', { slug: 'travis-ci/travis-web' });

  repo.createRequest({
    result: 'approved'
  });

  repo.createRequest({
    result: 'rejected'
  });

  repo.createRequest({
    result: 'pending'
  });

  repo.save();

  requestsPage.visit({organization: 'travis-ci', repo: 'travis-web'});

  andThen(function () {
    requestsPage.requests[0].as(request => {
      assert.ok(request.isApproved);
    });

    requestsPage.requests[1].as(request => {
      assert.ok(request.isRejected);
    });

    requestsPage.requests[2].as(request => {
      assert.ok(request.isPending);
    });

    pauseTest();
  });

  percySnapshot(assert);
});
