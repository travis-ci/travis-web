import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import insightsPage from 'travis/tests/pages/insights-owner';
// import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | owner insights', {
  beforeEach() {
    server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    // This should not require login but I can’t take the time to figure out why the test fails without it.
    // signInUser(user);
  }
});

test('the owner insights page shows insights components', (assert) => {
  let metricData = server.createList('insight-metric', 5);
  let metricTotal = metricData.reduce((acc, metric) => acc + metric.value, 0);
  let metricMinutes = (metricData.reduce((acc, metric) => acc + Math.round(metric.value / 60), 0));
  let queueTotal = (metricData.reduce((acc, metric) => acc + (Math.round((metric.value / 60) * 100) / 100), 0));
  let queueAvg = (Math.round((queueTotal / metricData.length) * 100) / 100);

  insightsPage.visit({ username: 'user-login' });

  andThen(() => {
    assert.equal(document.title, 'User Name - Travis CI');

    assert.equal(insightsPage.glances.length, 4);
    assert.equal(insightsPage.odysseys.length, 1);

    // Build count component
    insightsPage.glances[0].as(glance => {
      assert.equal(glance.name, 'Builds');
      assert.equal(glance.keyStat, metricTotal);
    });

    // Build minutes component
    insightsPage.glances[1].as(glance => {
      assert.equal(glance.name, 'Total Build Minutes');
      assert.equal(glance.keyStat, `${metricMinutes} mins`);
    });

    // Queue times component
    insightsPage.glances[2].as(glance => {
      assert.equal(glance.name, 'Average Queue Time');
      assert.equal(glance.keyStat, `${queueAvg} mins`);
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
  });
});

test('the owner insights page handles a lack of data', (assert) => {
  insightsPage.visit({ username: 'user-login' });

  andThen(() => {
    assert.equal(document.title, 'User Name - Travis CI');

    assert.equal(insightsPage.glances.length, 4);
    assert.equal(insightsPage.odysseys.length, 1);

    // Build count component
    insightsPage.glances[0].as(glance => {
      assert.equal(glance.name, 'Builds');
      assert.equal(glance.keyStat, '0');
    });

    // Build minutes component
    insightsPage.glances[1].as(glance => {
      assert.equal(glance.name, 'Total Build Minutes');
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
      assert.equal(glance.keyStat, '75');
    });

    // Build statuses component
    insightsPage.odysseys[0].as(odyssey => {
      assert.equal(odyssey.name, 'Build Statuses');
      assert.equal(odyssey.chart.trim(), 'No builds this month.');
    });
  });
});
