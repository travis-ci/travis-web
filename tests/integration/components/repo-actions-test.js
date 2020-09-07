import EmberObject from '@ember/object';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { stubService } from 'travis/tests/helpers/stub-service';

// stub auth service
const authStub = Service.extend({
  currentUser: EmberObject.create()
});

module('Integration | Component | repo actions', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    stubService('auth', authStub);
  });

  test('it shows cancel button only if job is cancelable', async function (assert) {
    this.set('job', EmberObject.create({ canCancel: true }));

    await render(hbs`{{repo-actions userHasPullPermissionForRepo=false job=this.job}}`);
    assert.dom('button[aria-label="Cancel job"]').doesNotExist();

    await render(hbs`{{repo-actions userHasPullPermissionForRepo=true job=this.job}}`);
    assert.dom('button[aria-label="Cancel job"]').exists();

  });

  test('it shows cancel button for build only if build is cancelable', async function (assert) {
    this.set('build', EmberObject.create({ canCancel: true }));

    await render(hbs`{{repo-actions userHasPullPermissionForRepo=false build=this.build}}`);
    assert.dom('button[aria-label="Cancel build"]').doesNotExist();

    await render(hbs`{{repo-actions userHasPullPermissionForRepo=true build=this.build}}`);
    assert.dom('button[aria-label="Cancel build"]').exists();

  });

  test('it shows restart button only if job is restartable', async function (assert) {
    this.set('job', EmberObject.create({ canRestart: true }));

    await render(hbs`{{repo-actions userHasPullPermissionForRepo=false job=this.job}}`);
    assert.dom('button[aria-label="Restart job"]').doesNotExist();

    await render(hbs`{{repo-actions userHasPullPermissionForRepo=true canOwnerBuild=true job=this.job}}`);
    assert.dom('button[aria-label="Restart job"]').exists();
  });

  test('it does not show restart button if owner cannot build', async function (assert) {
    this.set('job', EmberObject.create({ canRestart: true }));

    await render(hbs`{{repo-actions userHasPullPermissionForRepo=true canOwnerBuild=false job=this.job}}`);
    assert.dom('button[aria-label="Restart job"]').doesNotExist();
  });

  test('it shows prioritize button only if build is not prioritized, it is also not already started and if the org and user are having acces of it', async function (assert) {
    this.set('build', EmberObject.create({  canCancel: true }));
    await render(hbs`{{repo-actions userHasPullPermissionForRepo=true userHasPushPermissionForRepo=true build=this.build canPrioritize=true}}`);
    assert.dom('.action-button-container').exists();
    assert.dom('.action-button--prioritize').exists();
  });

  test('Prioritize button will be disabled in case user is not having push permission, ', async function (assert) {
    this.set('build', EmberObject.create({  canCancel: true }));
    await render(hbs`{{repo-actions userHasPullPermissionForRepo=true userHasPushPermissionForRepo=false build=this.build canPrioritize=true}}`);
    assert.dom('.action-button--prioritize').isDisabled();
  });

  test('Prioritize button will not be disabled in case user is having push permission, ', async function (assert) {
    this.set('build', EmberObject.create({  canCancel: true }));
    await render(hbs`{{repo-actions userHasPullPermissionForRepo=true userHasPushPermissionForRepo=true build=this.build canPrioritize=true}}`);
    assert.dom('.action-button--prioritize').isNotDisabled();
  });
});
