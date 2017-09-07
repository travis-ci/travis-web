import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import triggerBuildPage from 'travis/tests/pages/trigger-build';

moduleForAcceptance('Acceptance | repo/trigger build');

test('trigger link is not visible to not logged in users', function (assert) {
  const repo = server.create('repository', {
    name: 'difference-engine',
    slug: 'adal/difference-engine'
  });

  triggerBuildPage.visit({ slug: repo.slug });
  assert.ok(triggerBuildPage.popupTriggerLinkIsHidden, 'cannot see trigger build link');
});

moduleForAcceptance('Acceptance | repo/trigger build', {
  beforeEach() {
    this.currentUser = server.create('user', {
      name: 'Ada Lovelace',
      login: 'adal',
      repos_count: 1
    });

    const repo = server.create('repository', {
      name: 'difference-engine',
      slug: 'adal/difference-engine',
      permissions: {
        create_request: true
      }
    });

    this.repo = repo;

    const repoId = parseInt(repo.id);

    const defaultBranch = server.create('branch', {
      name: 'master',
      id: `/v3/repo/${repoId}/branch/master`,
      default_branch: true,
      exists_on_github: true,
      repository: repo
    });

    const latestBuild = defaultBranch.createBuild({
      state: 'passed',
      number: '1234',
      repository: repo
    });

    latestBuild.createCommit({
      sha: 'c0ffee'
    });

    repo.currentBuild = latestBuild;
    repo.save();
  }
});

test('triggering a custom build via the dropdown', function (assert) {
  triggerBuildPage.visit({ slug: this.repo.slug });

  andThen(() => {
    assert.equal(currentURL(), 'adal/difference-engine', 'we are on the repo page');
    assert.ok(triggerBuildPage.popupIsHidden, 'modal is hidden');
  });

  triggerBuildPage.openPopup();

  andThen(() => {
    assert.ok(triggerBuildPage.popupIsVisible, 'modal is visible after click');
  });

  triggerBuildPage.selectBranch('master');
  triggerBuildPage.writeMessage('This is a demo build');
  triggerBuildPage.writeConfig('script: echo "Hello World"');
  percySnapshot(assert);
  triggerBuildPage.clickSubmit();

  andThen(() => {});

  andThen(() => {
    assert.ok(triggerBuildPage.popupIsHidden, 'modal is hidden again');
    assert.equal(currentURL(), '/adal/difference-engine/builds/9999', 'we transitioned after the build was triggered');
  });
});
