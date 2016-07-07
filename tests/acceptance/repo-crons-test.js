import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import cronsPage from 'travis/tests/pages/crons';

import Ember from 'ember';

moduleForAcceptance('Acceptance | repo crons', {
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

    server.create('permissions', {
      admin: [repoId],
      push: [repoId],
      pull: [repoId],
      permissions: [repoId],
    });

    const primaryBranch = server.create('branch', {
      name: 'a cron branch yes'
    });

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);

    const beforeOneYearAgo = new Date(oneYearAgo.getTime() - 1000*60*5);

    const lastBuild = primaryBranch.createBuild({
      state: 'passed',
      number: '1919',
      finished_at: oneYearAgo,
      started_at: beforeOneYearAgo,
      event_type: 'cron',
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

    const failedCronBuildBranch = server.create('branch');

    const failedBuild = failedCronBuildBranch.createBuild({
      state: 'failed',
      event_type: 'cron',
      repository_id: repoId
    });

    failedBuild.createCommit(commitAttributes);
    failedBuild.save();

    const erroredCronBuildBranch = server.create('branch');

    const erroredBuild = erroredCronBuildBranch.createBuild({
      state: 'errored',
      event_type: 'cron',
      repository_id: repoId
    });

    erroredBuild.createCommit(commitAttributes);
    erroredBuild.save();
  }
});

test('view crons', function(assert) {
  cronsPage.visit({organization: 'killjoys', repo: 'living-a-feminist-life'});

  andThen(() => {
    assert.equal(cronsPage.crons().count, 3, 'expected three cron builds');

    const cron = cronsPage.crons(0);

    assert.ok(cron.passed, 'expected the first cron build to have passed');
    assert.equal(cron.name, 'successful-cron-branch');
    assert.equal(cron.committer, 'Sara Ahmed');
    assert.equal(cron.commitSha, '1234567');
    assert.equal(cron.commitDate, 'about a year ago');
    assert.equal(cron.duration, '5 min');

    assert.ok(cronsPage.crons(1).failed, 'expected the second cron build to have failed');
    assert.ok(cronsPage.crons(2).errored, 'expected the third cron build to have errored');
  });
});
