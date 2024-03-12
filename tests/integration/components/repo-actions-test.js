import EmberObject from '@ember/object';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { stubService } from 'travis/tests/helpers/stub-service';
import RepoActions from 'travis/components/repo-actions';

// stub auth service
const authStub = Service.extend({
  currentUser: EmberObject.create()
});

module('Integration | Component | repo actions', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    stubService('auth', authStub);
  });

  test('it shows cancel button only if job is cancelable - no cancel permissions for repo', async function (assert) {
    this.set('job', EmberObject.create({ canCancel: true }));

    this.owner.register('component:repo-actions', RepoActions.extend({userHasCancelPermissionForRepo: false}));
    await render(hbs`{{repo-actions job=this.job}}`);
    assert.dom('button[aria-label="Cancel job"]').doesNotExist();
  });

  test('it shows cancel button only if job is cancelable - with permissions to cancel for repo', async function (assert) {
    this.set('job', EmberObject.create({ canCancel: true }));

    this.owner.register('component:repo-actions', RepoActions.extend({userHasCancelPermissionForRepo: true}));
    await render(hbs`{{repo-actions job=this.job}}`);
    assert.dom('button[aria-label="Cancel job"]').exists();
  });

  test('it shows cancel button for build only if build is cancelable - no cancel permissions for repo', async function (assert) {
    this.set('build', EmberObject.create({ canCancel: true }));

    this.owner.register('component:repo-actions', RepoActions.extend({userHasCancelPermissionForRepo: false}));
    await render(hbs`{{repo-actions build=this.build}}`);
    assert.dom('button[aria-label="Cancel build"]').doesNotExist();
  });

  test('it shows cancel button for build only if build is cancelable - with permissions to cancel for repo', async function (assert) {
    this.set('build', EmberObject.create({ canCancel: true }));

    this.owner.register('component:repo-actions', RepoActions.extend({userHasCancelPermissionForRepo: true}));
    await render(hbs`{{repo-actions build=this.build}}`);
    assert.dom('button[aria-label="Cancel build"]').exists();
  });

  test('it shows restart button only if job is restartable - no cancel permissions for repo', async function (assert) {
    this.set('job', EmberObject.create({ canRestart: true }));

    this.owner.register('component:repo-actions', RepoActions.extend({userHasCancelPermissionForRepo: false,
      userHasRestartPermissionForRepo: false}));
    await render(hbs`{{repo-actions job=this.job}}`);
    assert.dom('button[aria-label="Restart job"]').doesNotExist();
  });


  test('it shows restart button only if job is restartable - with permissions to cancel for repo', async function (assert) {
    this.set('job', EmberObject.create({ canRestart: true }));

    this.owner.register('component:repo-actions', RepoActions.extend({userHasCancelPermissionForRepo: true, userHasRestartPermissionForRepo: true}));
    await render(hbs`{{repo-actions canOwnerBuild=true job=this.job}}`);
    assert.dom('button[aria-label="Restart job"]').exists();
  });

  test('it does not show restart button if owner cannot build', async function (assert) {
    this.set('job', EmberObject.create({ canRestart: true }));

    this.owner.register('component:repo-actions', RepoActions.extend({userHasCancelPermissionForRepo: true}));
    await render(hbs`{{repo-actions job=this.job}}`);
    assert.dom('button[aria-label="Restart job"]').doesNotExist();
  });

  test('it shows prioritize button only if build is not prioritized, it is also not already started and if the org and user are having acces of it', async function (assert) {
    this.set('build', EmberObject.create({  canCancel: true }));

    this.owner.register('component:repo-actions', RepoActions.extend({
      userHasCancelPermissionForRepo: true,
      userHasPullPermissionForRepo: true,
      userHasPushPermissionForRepo: true,
      canPrioritize: true}));
    await render(hbs`{{repo-actions build=this.build}}`);
    assert.dom('.action-button-container').exists();
    assert.dom('.action-button--prioritize').exists();
  });

  test('Prioritize button will be disabled in case user is not having push permission, ', async function (assert) {
    this.set('build', EmberObject.create({  canCancel: true }));

    this.owner.register('component:repo-actions', RepoActions.extend({
      userHasCancelPermissionForRepo: true,
      userHasPullPermissionForRepo: true,
      userHasPushPermissionForRepo: false,
      canPrioritize: true}));
    await render(hbs`{{repo-actions build=this.build}}`);
    assert.dom('.action-button--prioritize').isDisabled();
  });

  test('Prioritize button will not be disabled in case user is having push permission, ', async function (assert) {
    this.set('build', EmberObject.create({  canCancel: true }));

    this.owner.register('component:repo-actions', RepoActions.extend({
      userHasCancelPermissionForRepo: true,
      userHasPullPermissionForRepo: true,
      userHasPushPermissionForRepo: true,
      canPrioritize: true}));
    await render(hbs`{{repo-actions build=this.build}}`);
    assert.dom('.action-button--prioritize').isNotDisabled();
  });
});
