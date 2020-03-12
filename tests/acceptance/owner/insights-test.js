import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import insightsPage from 'travis/tests/pages/insights-owner';
import { settled } from '@ember/test-helpers';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { INSIGHTS_PRIVACY_OPTIONS } from 'travis/components/insights-privacy-selector';
import { percySnapshot } from 'ember-percy';
import { enableFeature } from 'ember-feature-flags/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | owner insights', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.currentUser = this.server.create('user', {
      name: 'Aria',
      login: 'bellsareringing',
      permissions: {
        sync: true,
      },
    });

    this.otherUser = this.server.create('user', {
      name: 'Mako',
      login: 'keepitwavy',
      permissions: {
        sync: false,
      },
    });
  });

  test('the owner insights page shows insights components', async function (assert) {
    this.server.createList('insight-metric', 15);

    await insightsPage.visit({ username: this.currentUser.login });
    await settled();

    assert.equal(insightsPage.glances.length, 4);
    assert.equal(insightsPage.odysseys.length, 1);

    // Build count component
    insightsPage.glances[0].as(glance => {
      assert.equal(glance.name, 'Total Builds');
      assert.equal(glance.keyStat, 448);
    });

    // Build minutes component
    insightsPage.glances[1].as(glance => {
      assert.equal(glance.name, 'Total Job Minutes');
      assert.equal(glance.keyStat, '6 mins');
    });

    // Queue times component
    insightsPage.glances[2].as(glance => {
      assert.equal(glance.name, 'Average Queue Time');
      assert.equal(glance.keyStat, '0.6 mins');
    });

    // Active repos component
    insightsPage.glances[3].as(glance => {
      assert.equal(glance.name, 'Active Repositories');
      assert.equal(glance.keyStat, '75');
    });

    // Build statuses component
    insightsPage.odysseys[0].as(odyssey => {
      assert.equal(odyssey.name, 'Build Statuses');
      assert.notEqual(odyssey.chart.trim(), 'No builds this month.');
    });

    // No Build Overlay
    assert.ok(insightsPage.noBuildOverlay.isHidden);

    percySnapshot(assert);
  });

  test('the owner insights page handles a lack of data', async function (assert) {
    await insightsPage.visit({ username: this.currentUser.login });
    await settled();

    assert.equal(insightsPage.glances.length, 4);
    assert.equal(insightsPage.odysseys.length, 1);

    // Build count component
    insightsPage.glances[0].as(glance => {
      assert.equal(glance.name, 'Total Builds');
      assert.equal(glance.keyStat, '0');
    });

    // Build minutes component
    insightsPage.glances[1].as(glance => {
      assert.equal(glance.name, 'Total Job Minutes');
      assert.equal(glance.keyStat, '0 mins');
    });

    // Queue times component
    insightsPage.glances[2].as(glance => {
      assert.equal(glance.name, 'Average Queue Time');
      assert.equal(glance.keyStat, '0 mins');
    });

    // Active repos component
    insightsPage.glances[3].as(glance => {
      assert.equal(glance.name, 'Active Repositories');
      assert.equal(glance.keyStat, '0');
    });

    // Build statuses component
    insightsPage.odysseys[0].as(odyssey => {
      assert.equal(odyssey.name, 'Build Statuses');
      assert.equal(odyssey.chart.trim(), 'No builds this month.');
    });

    // No Build Overlay
    assert.ok(insightsPage.noBuildOverlay.isVisible);
  });

  // No-build overlay states
  test('No-build overlay displays correctly when not logged in', async function (assert) {
    await insightsPage.visit({ username: this.currentUser.login });
    await settled();

    assert.ok(insightsPage.noBuildOverlay.isVisible);
    assert.equal(insightsPage.noBuildOverlay.title, 'Build to get monthly insights');
    assert.equal(insightsPage.noBuildOverlay.text, 'All the build status results from the last 30 days will appear here. Have you tried logging in?');
    assert.equal(insightsPage.noBuildOverlay.link.text, 'Sign in');

    await insightsPage.tabs.clickWeek();
    await settled();

    assert.ok(insightsPage.noBuildOverlay.isVisible);
    assert.equal(insightsPage.noBuildOverlay.title, 'It\'s been a quiet week for builds');
    assert.equal(insightsPage.noBuildOverlay.text, 'All the build status results from the last 7 days will appear here. Have you tried logging in?');
    assert.equal(insightsPage.noBuildOverlay.link.text, 'Sign in');
  });

  test('No-build overlay for current user displays correctly when logged in', async function (assert) {
    signInUser(this.currentUser);

    await insightsPage.visit({ username: this.currentUser.login });
    await settled();

    assert.ok(insightsPage.noBuildOverlay.isVisible);
    assert.equal(insightsPage.noBuildOverlay.title, 'Build to get monthly insights');
    assert.equal(insightsPage.noBuildOverlay.text, 'All the build status results from the last 30 days will appear here.');
    assert.equal(insightsPage.noBuildOverlay.link.text, 'Let\'s get you going');

    await insightsPage.tabs.clickWeek();
    await settled();

    assert.ok(insightsPage.noBuildOverlay.isVisible);
    assert.equal(insightsPage.noBuildOverlay.title, 'It\'s been a quiet week for builds');
    assert.equal(insightsPage.noBuildOverlay.text, 'All the build status results from the last 7 days will appear here.');
    assert.equal(insightsPage.noBuildOverlay.link.text, 'Want help building?');
  });

  test('No-build overlay for other user displays correctly when logged in', async function (assert) {
    signInUser(this.currentUser);

    await insightsPage.visit({ username: this.otherUser.login });
    await settled();

    assert.ok(insightsPage.noBuildOverlay.isVisible);
    assert.equal(insightsPage.noBuildOverlay.title, 'Build to get monthly insights');
    assert.equal(insightsPage.noBuildOverlay.text, 'All the build status results from the last 30 days will appear here.');
    assert.notOk(insightsPage.noBuildOverlay.link.isPresent);

    await insightsPage.tabs.clickWeek();
    await settled();

    assert.ok(insightsPage.noBuildOverlay.isVisible);
    assert.equal(insightsPage.noBuildOverlay.title, 'It\'s been a quiet week for builds');
    assert.equal(insightsPage.noBuildOverlay.text, 'All the build status results from the last 7 days will appear here.');
    assert.notOk(insightsPage.noBuildOverlay.link.isPresent);
  });

  // Privacy selector
  test('the owner insights page displays privacy selector on PRO version', async function (assert) {
    enableFeature('proVersion');
    signInUser(this.currentUser);

    await insightsPage.visit({ username: this.currentUser.login });
    await settled();

    const { privacySelector } = insightsPage;

    assert.ok(privacySelector.isVisible);
    assert.equal(privacySelector.mainField, INSIGHTS_PRIVACY_OPTIONS.PRIVATE);
  });
});
