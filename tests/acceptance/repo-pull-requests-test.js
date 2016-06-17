import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import pullRequestsPage from 'travis/tests/pages/pull-requests';

moduleForAcceptance('Acceptance | repo pull requests', {
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
      default_branch: true
    });
  }
});

test('view pull requests', function(assert) {
  pullRequestsPage.visit({organization: 'killjoys', repo: 'living-a-feminist-life'});

  andThen(() => {
    // FIXME placeholder
    assert.equal(find('h2.page-title').text(), 'No pull request builds for this repository');
  });
});
