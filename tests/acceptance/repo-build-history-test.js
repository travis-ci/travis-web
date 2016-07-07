import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildsPage from 'travis/tests/pages/build-history';

import Ember from 'ember';

moduleForAcceptance('Acceptance | repo build history', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    signInUser(currentUser);

    const repository = server.create('repository', {
      slug: 'killjoys/living-a-feminist-life'
    });

    const repoId = parseInt(repository.id);

    const branch = server.create('branch');

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);

    const beforeOneYearAgo = new Date(oneYearAgo.getTime() - 1000*60*5);

    const lastBuild = branch.createBuild({
      state: 'passed',
      number: '1919',
      finished_at: oneYearAgo,
      started_at: beforeOneYearAgo,
      event_type: 'push',
      repository_id: repoId
    });

    const commitAttributes = {
      sha: '1234567890',
      author_name: currentUser.name
    };

    lastBuild.createCommit(Ember.assign({
      branch: 'successful-cron-branch'
    }, commitAttributes));
    lastBuild.save();

    const failedBuild = branch.createBuild({
      state: 'failed',
      event_type: 'cron',
      repository_id: repoId
    });

    failedBuild.createCommit(commitAttributes);
    failedBuild.save();

    const erroredBuild = branch.createBuild({
      state: 'errored',
      event_type: 'push',
      repository_id: repoId
    });

    erroredBuild.createCommit(commitAttributes);
    erroredBuild.save();
  }
});

test('view crons', function(assert) {
  buildsPage.visit({organization: 'killjoys', repo: 'living-a-feminist-life'});

  andThen(() => {
    assert.equal(buildsPage.builds().count, 3, 'expected three builds');

    const build = buildsPage.builds(0);

    assert.ok(build.passed, 'expected the first build to have passed');
    assert.equal(build.name, 'successful-cron-branch');
    assert.equal(build.committer, 'Sara Ahmed');
    assert.equal(build.commitSha, '1234567');
    assert.equal(build.commitDate, 'about a year ago');
    assert.equal(build.duration, '5 min');

    assert.ok(buildsPage.builds(1).failed, 'expected the second build to have failed');
    assert.ok(buildsPage.builds(2).errored, 'expected the third build to have errored');
  });
});
