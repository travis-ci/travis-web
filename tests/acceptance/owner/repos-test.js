import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import ownerPage from 'travis/tests/pages/owner';

moduleForAcceptance('Acceptance | owner repositories', {
  beforeEach() {
    server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    // create active repo
    const firstRepository = server.create('repository', {
      slug: 'feministkilljoy/living-a-feminist-life'
    });

    const primaryBranch = firstRepository.createBranch({
      name: 'primary',
      id: `/v3/repos/${firstRepository.id}/branches/primary`,
      default_branch: true
    });

    firstRepository.save();

    const lastBuild = primaryBranch.createBuild({
      state: 'failed',
      number: '1917'
    });

    lastBuild.createCommit({
      sha: 'abc124'
    });

    lastBuild.save();

    // create active repo
    server.create('repository', {
      slug: 'feministkilljoy/willful-subjects'
    });

    server.create('repository', {
      slug: 'other/other',
      skipPermissions: true
    });
  }
});

test('the owner page shows their repositories', (assert) => {
  ownerPage.visit({ username: 'feministkilljoy' });

  andThen(() => {
    assert.equal(ownerPage.repos().count, 2);

    assert.equal(ownerPage.repos(0).name, 'willful-subjects');
    assert.equal(ownerPage.repos(0).noBuildMessage, 'There is no build on the default branch yet.');

    assert.equal(ownerPage.repos(1).name, 'living-a-feminist-life');
    assert.equal(ownerPage.repos(1).buildNumber, '1917');
    assert.equal(ownerPage.repos(1).defaultBranch, 'primary');
    assert.equal(ownerPage.repos(1).commitSha, 'abc124');
  });
});
