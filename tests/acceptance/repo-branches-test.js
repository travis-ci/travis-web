import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import branchesPage from 'travis/tests/pages/branches';

moduleForAcceptance('Acceptance | repo branches', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    const organization = server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30
    });

    const repository = server.create('repository', {
      name: 'living-a-feminist-life'
    });

    const repoId = parseInt(repository.id);

    const primaryBranch = server.create('branch', {
      name: 'primary',
      id: `/v3/repos/${repoId}/branches/primary`,
      default_branch: true,

      // FIXME how to serialise related resources in V3?

      repository: {
        '@type': 'repository',
        '@href': `/v3/repo/${repoId}`,
        '@representation': 'minimal',
        id: repoId,
        name: repository.name
      },

      last_build: {
        '@type': 'build',
        '@href': '/v3/build/111',
        '@representation': 'minimal',
        id: '111',
        state: 'passed'
      }
    });

    primaryBranch.createBuild({
      state: 'passed'
    });
  }
});

test('view branches', function(assert) {
  branchesPage.visit({organization: 'killjoys', repo: 'living-a-feminist-life'});

  andThen(() => {
    assert.equal(branchesPage.defaultBranch.name, 'primary');
    assert.ok(branchesPage.defaultBranch.passed, 'expected default branch last build to have passed');
    assert.equal(branchesPage.defaultBranch.buildCount, '1 builds');
  });
});
