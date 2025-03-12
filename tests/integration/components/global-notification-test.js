import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { enableFeature } from 'ember-feature-flags/test-support';
import signInUser from 'travis/tests/helpers/sign-in-user';
import Service from '@ember/service';
import config from 'travis/config/environment';

module('Integration | Component | global notification', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user');
    signInUser(currentUser);
    const authStub = Service.extend({
      currentUser: currentUser
    });

    this.storage = this.owner.lookup('service:storage');
    this.owner.register('service:auth', authStub);
    this.auth = this.owner.lookup('service:auth');
    this.features = this.owner.lookup('service:features');

    this.server.get('/v3/enterprise_license', (schema, request) => ({
      'license_id': 'ad12345',
      'seats': '30',
      'active_users': '21',
      'license_type': 'trial',
      'expiration_time': '2019-01-01T00:00:00Z'
    }));
  });

  test('renders global notification with unconfirmed user banner', async function (assert) {
    assert.expect(2);

    await render(hbs`{{global-notification}}`);

    settled().then(() => {
      assert.dom('.global-notification-warning').exists('page renders');
      assert.dom('[data-test-unconfirmed-user-banner]').containsText('Please check your email and confirm your account, before that you will have limited build functions.');
    });
  });

  test('renders global notification with no plan banner', async function (assert) {
    assert.expect(2);

    let user = {
      hasV2Subscription: false,
      subscription: undefined,
      allowance: {
        subscriptionType: 3
      },
      vcsType: 'Organization'
    };
    this.set('user', user);
    await render(hbs`{{global-notification user=this.user}}`);

    settled().then(() => {
      assert.dom('.global-notification-warning').exists('page renders');
      assert.dom('[data-test-no-plan-banner]').containsText('Please select a plan in order to use Travis CI');
    });
  });

  test('renders global notification with migration banner', async function (assert) {
    assert.expect(2);

    await render(hbs`{{global-notification}}`);

    settled().then(() => {
      assert.dom('.global-notification-warning').exists();
      assert.dom('[data-test-migration-banner]').containsText('Since June 15th, 2021, the building on travis-ci.org is ceased. Please use travis-ci.com from now on.');
    });
  });

  test('renders global notification with repository security banner', async function (assert) {
    assert.expect(2);

    await render(hbs`{{global-notification}}`);

    settled().then(() => {
      assert.dom('.enterprise-banner.security').exists('page renders');
      assert.dom('.enterprise-banner.security p').containsText('If you have SSH keys defined for your repositories, please review their settings now.');
    });
  });

  test('renders global notification with temporary announcement banner', async function (assert) {
    assert.expect(2);
    this.storage.setItem('travis.temporary-announcement-banner', 'Old message');
    config.tempBanner.tempBannerEnabled = 'true';
    config.tempBanner.tempBannerMessage = 'Temporary announcement!';
    await render(hbs`{{global-notification}}`);

    settled().then(() => {
      assert.dom('.notice-banner--yellow').exists('page renders');
      assert.dom('.notice-banner--yellow').containsText('Temporary announcement!');
    });
  });

  test('renders global notification with enterprise banner', async function (assert) {
    assert.expect(1);
    enableFeature('enterpriseVersion');

    await render(hbs`{{global-notification}}`);

    settled().then(() => {
      assert.dom('.enterprise-banner').exists();
    });
  });
});
