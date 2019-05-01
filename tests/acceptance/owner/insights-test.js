import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import insightsPage from 'travis/tests/pages/insights-owner';
import { settled } from '@ember/test-helpers';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { INSIGHTS_PRIVACY_OPTIONS } from 'travis/components/insights-privacy-selector';

moduleForAcceptance('Acceptance | owner insights', {
  beforeEach() {
    this.currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });
  }
});

test('the owner insights page shows insights components', async function (assert) {
  server.createList('insight-metric', 15);

  await insightsPage.visit({ username: 'user-login' });
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
  await insightsPage.visit({ username: 'user-login' });
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
  assert.equal(insightsPage.noBuildOverlay.title, 'Build to get monthly insights');
  assert.equal(insightsPage.noBuildOverlay.text, 'All the build status results from the last 30 days will appear here.');
  assert.equal(insightsPage.noBuildOverlay.link, 'Let\'s get you going');
});

test('the owner insights page displays privacy selector on PRO version', async function (assert) {
  withFeature('proVersion');
  signInUser(this.currentUser);

  await insightsPage.visit({ username: this.currentUser.login });
  await settled();

  const { privacySelector } = insightsPage;

  assert.ok(privacySelector.isVisible);
  assert.equal(privacySelector.mainField, INSIGHTS_PRIVACY_OPTIONS.PRIVATE);
});
