import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import triggerBuildPage from 'travis/tests/pages/trigger-build';
import topPage from 'travis/tests/pages/top';
import { Response } from 'ember-cli-mirage';

moduleForAcceptance('Acceptance | repo/trigger build');

test('trigger link is not visible to not logged in users', function (assert) {
  server.create('repository', {
    name: 'difference-engine',
    slug: 'adal/difference-engine'
  });

  triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });
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

    server.create('branch', {
      name: 'deleted',
      id: `/v3/repo/${repoId}/branch/deleted`,
      default_branch: false,
      exists_on_github: false,
      repository: repo
    });

    repo.currentBuild = latestBuild;
    repo.save();
  }
});

test('triggering a custom build via the dropdown', function (assert) {
  triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });

  andThen(() => {
    assert.equal(currentURL(), 'adal/difference-engine', 'we are on the repo page');
    assert.ok(triggerBuildPage.popupIsHidden, 'modal is hidden');
  });

  triggerBuildPage.openPopup();

  andThen(() => {
    assert.ok(triggerBuildPage.popupIsVisible, 'modal is visible after click');

    assert.equal(triggerBuildPage.branches.length, 1, 'expected the not-on-GitHub branch to be hidden');
    assert.equal(triggerBuildPage.branches[0].value, 'master');
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

test('an error triggering a build is displayed', function (assert) {
  server.post('/repo/:repo_id/requests', function (schema, request) {
    return new Response(500, {}, {});
  });

  triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });
  triggerBuildPage.openPopup();
  triggerBuildPage.selectBranch('master');
  triggerBuildPage.clickSubmit();

  andThen(() => {
    assert.equal(topPage.flashMessage.text, 'Oops, something went wrong, please try again.');
  });
});

test('a 429 shows a specific error message', function (assert) {
  server.post('/repo/:repo_id/requests', function (schema, request) {
    return new Response(429, {}, {});
  });

  triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });
  triggerBuildPage.openPopup();
  triggerBuildPage.selectBranch('master');
  triggerBuildPage.clickSubmit();

  andThen(() => {
    assert.equal(topPage.flashMessage.text, 'You’ve exceeded the limit for triggering builds, please wait a while before trying again.');
  });
});
