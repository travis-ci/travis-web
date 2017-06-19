import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/build';

moduleForAcceptance('Acceptance | builds/view pull request', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('renders a pull request', function (assert) {
  let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

  const branch = server.create('branch', { name: 'acceptance-tests' });
  let commit = server.create('commit', { sha: 'abc123', author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', {
    number: '5',
    state: 'passed',
    pull_request_number: '10',
    pull_request_title: 'Resist',
    event_type: 'pull_request',
    repository,
    branch,
    commit
  });
  let job = server.create('job', { number: '5.1', state: 'passed', build, commit, repository, config: { language: 'Hello' } });

  commit.update('build', build);
  commit.update('job', job);

  page.visit({ slug: 'travis-ci/travis-web', build_id: build.id });

  andThen(() => {
    assert.equal(document.title, 'Build #5 - travis-ci/travis-web - Travis CI');

    assert.ok(page.buildTabLinkIsActive, 'build tab link is active');
    assert.equal(page.buildTabLinkText, 'Build #5');

    assert.equal(page.branchName, 'Pull Request #10');
    assert.equal(page.commitSha, 'Commit abc123');
    assert.equal(page.compare, '#10: Resist');
    assert.equal(page.commitBranch, 'Branch acceptance-tests');
  });

  percySnapshot(assert);
});
