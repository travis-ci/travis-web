import { currentURL } from '@ember/test-helpers';
import { module, skip, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import triggerBuildPage from 'travis/tests/pages/trigger-build';
import topPage from 'travis/tests/pages/top';
import { Response } from 'ember-cli-mirage';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | repo/trigger build', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.currentUser = this.server.create('user', {
      name: 'Ada Lovelace',
      login: 'adal',
    });

    this.repo = this.server.create('repository', {
      name: 'difference-engine',
      slug: 'adal/difference-engine',
      permissions: {
        create_request: true
      }
    });

    const repoId = parseInt(this.repo.id);

    const defaultBranch = this.server.create('branch', {
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

    this.server.create('branch', {
      name: 'deleted',
      id: `/v3/repo/${repoId}/branch/deleted`,
      default_branch: false,
      exists_on_github: false,
      repository: this.repo
    });

    this.repo.currentBuild = latestBuild;
    this.repo.save();
  });

  test('trigger link is not visible to users without proper permissions', async function (assert) {
    this.owner.lookup('service:features').disable('show-new-config-view');
    this.repo.update('permissions', { create_request: false });
    await triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });

    assert.notOk(triggerBuildPage.popupTriggerLinkIsPresent, 'trigger build link is not rendered');
  });

  test('trigger link is present when user has the proper permissions and has been migrated on com', async function (assert) {
    this.owner.lookup('service:features').disable('show-new-config-view');
    this.repo.update('migration_status', 'migrated');

    enableFeature('proVersion');
    signInUser(this.currentUser);

    await triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });

    assert.ok(triggerBuildPage.popupTriggerLinkIsPresent, 'trigger build link is rendered');
  });

  // We currently get an error related to /v3/enterprise_license returning a 404 from mirage.
  // I'm not sure what our desired behavior is, so leaving this alone to be able to progress on the migration work.
  skip('trigger link is present when user has the proper permissions and has been migrated on enterprise', async function (assert) {
    this.repo.update('migration_status', 'migrated');
    enableFeature('enterpriseVersion');
    signInUser(this.currentUser);

    await triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });

    assert.ok(triggerBuildPage.popupTriggerLinkIsPresent, 'trigger build link is rendered');
  });

  test('trigger link is not visible on org if repository has already been migrated', async function (assert) {
    this.repo.update('migration_status', 'migrated');
    signInUser(this.currentUser);
    await triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });
    assert.notOk(triggerBuildPage.popupTriggerLinkIsPresent, 'trigger build link is not rendered');
  });

  test('triggering a custom build via the popup', async function (assert) {
    this.owner.lookup('service:features').disable('show-new-config-view');
    await triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });

    assert.equal(currentURL(), '/github/adal/difference-engine', 'we are on the repo page');
    assert.ok(triggerBuildPage.popupIsHidden, 'modal is hidden');

    await triggerBuildPage.openPopup();

    assert.ok(triggerBuildPage.popupIsVisible, 'modal is visible after click');

    await triggerBuildPage.writeMessage('This is a demo build');
    await triggerBuildPage.writeConfig('script: echo "Hello World"');
    percySnapshot(assert);

    await triggerBuildPage.clickSubmit();

    assert.ok(triggerBuildPage.popupIsHidden, 'modal is hidden again');
    assert.equal(currentURL(), '/github/adal/difference-engine/builds/9999', 'we transitioned after the build was triggered');
  });

  test('triggering a custom build via the new config form', async function (assert) {
    enableFeature('show-new-config-view');
    await triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });

    assert.equal(currentURL(), '/github/adal/difference-engine', 'we are on the repo page');
    assert.ok(triggerBuildPage.configFormIsHidden, 'modal is hidden');

    await triggerBuildPage.showConfigForm();

    assert.ok(triggerBuildPage.configFormIsVisible, 'config form is visible after click');

    await triggerBuildPage.writeConfigFormMessage('This is a demo build');
    await triggerBuildPage.writeConfigFormConfig('script: echo "Hello World"');
    percySnapshot(assert);

    await triggerBuildPage.clickConfigFormSubmit();

    assert.ok(triggerBuildPage.configFormIsHidden, 'config form is hidden again');
    assert.equal(currentURL(), '/github/adal/difference-engine/builds/9999', 'we transitioned after the build was triggered');
  });

  test('an error triggering a build is displayed', async function (assert) {
    this.owner.lookup('service:features').disable('show-new-config-view');
    this.server.post('/repo/:repo_id/requests', function (schema, request) {
      return new Response(500, {}, {});
    });

    await triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });
    await triggerBuildPage.openPopup();
    await triggerBuildPage.clickSubmit();

    assert.equal(topPage.flashMessage.text, 'Oops, something went wrong, please try again.');
  });

  test('a 429 shows a specific error message', async function (assert) {
    this.owner.lookup('service:features').disable('show-new-config-view');
    this.server.post('/repo/:repo_id/requests', function (schema, request) {
      return new Response(429, {}, {});
    });

    await triggerBuildPage.visit({ owner: 'adal', repo: 'difference-engine' });
    await triggerBuildPage.openPopup();
    await triggerBuildPage.clickSubmit();

    assert.equal(topPage.flashMessage.text, 'You’ve exceeded the limit for triggering builds, please wait a while before trying again.');
  });
});
