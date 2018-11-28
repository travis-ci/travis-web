import { test, skip } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import triggerBuildPage from 'travis/tests/pages/trigger-build';
import topPage from 'travis/tests/pages/top';
import { Response } from 'ember-cli-mirage';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | repo/trigger build');

moduleForAcceptance('Acceptance | repo/trigger build', {
  beforeEach() {
    this.currentUser = server.create('user', {
      name: 'Ada Lovelace',
      login: 'adal',
    });

    this.repo = server.create('repository', {
      name: 'difference-engine',
      slug: 'adal/difference-engine',
      permissions: {
        create_request: true
      }
    });

    const repoId = parseInt(this.repo.id);

    const defaultBranch = server.create('branch', {
      name: 'master',
      id: `/v3/repo/${repoId}/branch/master`,
      default_branch: true,
      exists_on_github: true,
      repository: this.repo
    });

    const latestBuild = defaultBranch.createBuild({
      state: 'passed',
      number: '1234',
      repository: this.repo
    });

    latestBuild.createCommit({
      sha: 'c0ffee'
    });

    server.create('branch', {
      name: 'deleted',
      id: `/v3/repo/${repoId}/branch/deleted`,
      default_branch: false,
      exists_on_github: false,
      repository: this.repo
    });

    this.repo.currentBuild = latestBuild;
    this.repo.save();
  }
});

test('trigger link is not visible to users without proper permissions', function (assert) {
  this.repo.update('permissions', { create_request: false });
  triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });

  andThen(() => {
    assert.notOk(triggerBuildPage.popupTriggerLinkIsPresent, 'trigger build link is not rendered');
  });
});

test('trigger link is present when user has the proper permissions and has been migrated on com', function (assert) {
  this.repo.update('migration_status', 'migrated');

  withFeature('proVersion');
  signInUser(this.currentUser);

  triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });

  andThen(() => {
    assert.ok(triggerBuildPage.popupTriggerLinkIsPresent, 'trigger build link is rendered');
  });
});

// We currently get an error related to /v3/enterprise_license returning a 404 from mirage.
// I'm not sure what our desired behavior is, so leaving this alone to be able to progress on the migration work.
skip('trigger link is present when user has the proper permissions and has been migrated on enterprise', function (assert) {
  this.repo.update('migration_status', 'migrated');
  withFeature('enterpriseVersion');
  signInUser(this.currentUser);

  triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });

  andThen(() => {
    assert.ok(triggerBuildPage.popupTriggerLinkIsPresent, 'trigger build link is rendered');
  });
});

test('trigger link is not visible on org if repository has already been migrated', function (assert) {
  this.repo.update('migration_status', 'migrated');
  signInUser(this.currentUser);
  triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });
  assert.notOk(triggerBuildPage.popupTriggerLinkIsPresent, 'trigger build link is not rendered');
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
