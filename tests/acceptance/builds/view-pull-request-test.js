import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import page from 'travis/tests/pages/build';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { percySnapshot } from 'ember-percy';

module('Acceptance | builds/view pull request', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('renders a pull request', async function (assert) {
    let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

    let commitBody =
      'Within the organization there is a gap between words and deeds, between what organizations say they will do, ' +
      'or what they are committed to doing, and what they are doing. – Sara Ahmed';

    const branch = server.create('branch', { name: 'acceptance-tests' });
    let  gitUser = server.create('git-user', { name: 'Mr T' });
    let commit = server.create('commit', {
      author: gitUser,
      committer: gitUser,
      committer_name: 'Mr T',
      branch: 'acceptance-tests',
      message: `This is a message\n${commitBody}`,
      branch_is_default: true
    });
    let build = server.create('build', {
      number: '5',
      state: 'passed',
      pull_request_number: '10',
      pull_request_title: 'Resist',
      event_type: 'pull_request',
      repository,
      branch,
      commit,
      isTag: false
    });
    let job = server.create('job', { number: '5.1', state: 'passed', build, commit, repository, config: { language: 'Hello' } });

    commit.update('build', build);
    commit.update('job', job);

    await page.visit({ owner: 'travis-ci', repo: 'travis-web', build_id: build.id });

    assert.equal(document.title, 'Build #5 - travis-ci/travis-web - Travis CI');

    assert.ok(page.buildTabLinkIsActive, 'build tab link is active');
    assert.equal(page.buildTabLinkText, 'Build #5');

    assert.equal(page.branchName.text, 'Pull Request #10');
    assert.equal(page.branchName.title, 'Resist');

    assert.equal(page.commitSha, 'Commit abc123');
    assert.equal(page.compare, '#10: Resist');
    assert.equal(page.commitBranch, 'Branch acceptance-tests', 'shows the PR branch');

    assert.equal(page.commitDescription.text, commitBody);
    assert.equal(page.commitDescription.title, commitBody);
    assert.ok(page.commitDescription.isFaded);

    percySnapshot(assert);
  });
});
