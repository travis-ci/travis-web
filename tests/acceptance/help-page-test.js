import { module, test } from 'qunit';
import { settled } from '@ember/test-helpers';
import { selectChoose } from 'ember-power-select/test-support';
import moment from 'moment';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
import signInUser from 'travis/tests/helpers/sign-in-user';
import helpPage from 'travis/tests/pages/help';
import config from 'travis/config/environment';
import { setupMirage } from 'ember-cli-mirage/test-support';

import {
  UTC_START_TIME,
  UTC_END_TIME,
  DATE_FORMAT
} from 'travis/components/zendesk-request-form';

const { apiHost, createRequestEndpoint } = config.zendesk;

const checkBasicStructure = (assert, isSignedIn) => {
  const { greetingSection, resourceSection, supportSection, topicSection } = helpPage;
  const { username, header, navigationLinks, status } = greetingSection;

  assert.ok(greetingSection.isPresent);
  assert.ok(header.isPresent);
  assert.ok(navigationLinks.isPresent);
  assert.ok(status.isPresent);
  assert.equal(username.isPresent, isSignedIn);

  assert.ok(resourceSection.isPresent);
  assert.ok(resourceSection.image.isPresent);
  assert.ok(resourceSection.header.isPresent);
  assert.ok(resourceSection.list.isPresent);
  assert.equal(resourceSection.list.items.length, 5);
  assert.ok(resourceSection.button.isPresent);

  assert.ok(topicSection.isPresent);
  assert.ok(topicSection.image.isPresent);
  assert.ok(topicSection.header.isPresent);
  assert.ok(topicSection.list.isPresent);
  assert.equal(topicSection.list.items.length, 5);
  assert.ok(topicSection.button.isPresent);

  assert.ok(supportSection.isPresent);
};

module('Acceptance | help page', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('for .org users', function (hooks) {
    hooks.beforeEach(async function () {
      await helpPage.visit();
    });

    test('it has correct structure', function (assert) {
      checkBasicStructure(assert, false);

      const { supportSection } = helpPage;

      assert.ok(supportSection.communityHeader.isPresent);
      assert.ok(supportSection.communityImage.isPresent);
    });
  });

  module('for .com unauthorised user', function (hooks) {
    hooks.beforeEach(async function () {
      enableFeature('proVersion');
      await helpPage.visit();
    });

    test('it has correct structure', function (assert) {
      checkBasicStructure(assert, false);
    });

    test('it shows log in stub', function (assert) {
      const { logInHeader, logInImage, logInButton } = helpPage.supportSection;

      assert.ok(logInHeader.isPresent);
      assert.ok(logInImage.isPresent);
      assert.ok(logInButton.isPresent);
    });
  });

  module('for .com education user', function (hooks) {
    hooks.beforeEach(async function () {
      this.user = this.server.create('user', {
        education: true,
      });
      enableFeature('proVersion');
      await signInUser(this.user);
      await helpPage.visit();
    });

    test('it has correct structure', function (assert) {
      checkBasicStructure(assert, true);

      const { form } = helpPage.supportSection;
      const { email, subject, description, submit } = form;

      assert.ok(form.isPresent);
      assert.ok(email.isPresent);
      assert.ok(subject.isPresent);
      assert.ok(description.isPresent);
      assert.ok(submit.isPresent);
    });
  });

  module('for .com trial user', function (hooks) {
    hooks.beforeEach(async function () {
      this.user = this.server.create('user');
      enableFeature('proVersion');
    });

    test('it has correct structure', async function (assert) {
      this.trial = this.server.create('trial', {
        has_active_trial: true,
        builds_remaining: 100,
        owner: this.user,
        status: 'new',
        created_at: new Date(2018, 7, 16),
        permissions: {
          read: true,
          write: true
        }
      });

      await signInUser(this.user);
      await helpPage.visit();

      checkBasicStructure(assert, true);
      assert.ok(helpPage.supportSection.form.isPresent);
    });

    test('form not present after trial', async function (assert) {
      this.trial = this.server.create('trial', {
        has_active_trial: true,
        builds_remaining: 0,
        owner: this.user,
        status: 'ended',
        created_at: new Date(2018, 7, 16),
        permissions: {
          read: true,
          write: true
        }
      });

      await signInUser(this.user);
      await helpPage.visit();

      assert.notOk(helpPage.supportSection.form.isPresent);
    });

    test('form present when subscribed after trial', async function (assert) {
      this.trial = this.server.create('trial', {
        has_active_trial: true,
        builds_remaining: 0,
        owner: this.user,
        status: 'ended',
        created_at: new Date(2018, 7, 16),
        permissions: {
          read: true,
          write: true
        }
      });

      this.subscription = this.server.create('subscription', {
        owner: this.user,
        status: 'subscribed',
        valid_to: new Date(),
      });

      await signInUser(this.user);
      await helpPage.visit();
      await settled();

      assert.ok(helpPage.supportSection.form.isPresent);
    });

    test('form present when org subscribed after trial', async function (assert) {
      this.trial = this.server.create('trial', {
        has_active_trial: true,
        builds_remaining: 0,
        owner: this.user,
        status: 'ended',
        created_at: new Date(2018, 7, 16),
        permissions: {
          read: true,
          write: true
        }
      });

      this.organization = this.server.create('organization', {
        name: 'Org Name',
        type: 'organization',
        login: 'org-login',
        permissions: {
          createSubscription: false
        }
      });

      this.subscription = this.server.create('subscription', {
        owner: this.organization,
        status: 'subscribed',
        valid_to: new Date(),
      });

      await signInUser(this.user);
      await helpPage.visit();

      assert.ok(helpPage.supportSection.form.isPresent);
    });
  });

  module('for .com authorised user', function (hooks) {
    hooks.beforeEach(async function () {
      this.user = this.server.create('user');
      enableFeature('proVersion');
      await signInUser(this.user);
      await helpPage.visit();
    });

    test('it has correct structure', function (assert) {
      checkBasicStructure(assert, true);
    });

    test('it shows correct support hours', function (assert) {
      const { hours } = helpPage.supportSection;

      const startTime = UTC_START_TIME.local().format(DATE_FORMAT);
      const endTime = UTC_END_TIME.local().format(DATE_FORMAT);
      const timezone = moment.tz(moment.tz.guess()).format('z');

      assert.ok(hours.isPresent);
      assert.equal(hours.text, `${startTime} ${timezone} – ${endTime} ${timezone}`);
    });

    test('it shows request form', function (assert) {
      const { form } = helpPage.supportSection;
      const { email, subject, description, submit } = form;

      assert.ok(form.isPresent);
      assert.ok(email.isPresent);
      assert.ok(subject.isPresent);
      assert.ok(description.isPresent);
      assert.ok(submit.isPresent);
    });

    module('request to Zendesk API', function (hooks) {
      const mockData = {
        subject: 'Test Request',
        description: 'Some description'
      };

      hooks.beforeEach(function () {
        this.requestHandler = (request) => JSON.parse(request.requestBody);
        this.server.post(`${apiHost}${createRequestEndpoint}`, (schema, request) => {
          return this.requestHandler(request);
        });
      });

      test('succeeds when all fields filled properly', async function (assert) {
        const { subject, description, submit } = helpPage.supportSection.form;
        const { successImage, successHeader, successMessage } = helpPage.supportSection;

        await subject.fill(mockData.subject);
        await description.fill(mockData.description);
        await submit.click();
        await settled();

        assert.ok(successHeader.isPresent);
        assert.ok(successImage.isPresent);
        assert.ok(successMessage.isPresent);
      });

      test('contains all necessary data', async function (assert) {
        const { subject, description, submit } = helpPage.supportSection.form;
        let data = {};

        this.requestHandler = (request) => {
          data = JSON.parse(request.requestBody).request;
          return data;
        };

        await subject.fill(mockData.subject);
        await description.fill(mockData.description);
        await submit.click();
        await settled();

        assert.equal(data.requester.email, this.user.email);
        assert.equal(data.requester.name, this.user.name);
        assert.equal(data.subject, mockData.subject);
        assert.ok(~data.comment.body.indexOf(mockData.description));
      });

      test('doesn\'t get sent if form is invalid', async function (assert) {
        const { submit } = helpPage.supportSection.form;
        let requestIsSent = false;

        this.requestHandler = (request) => {
          requestIsSent = true;
          return JSON.parse(request.requestBody);
        };

        await submit.click();
        await settled();

        assert.equal(requestIsSent, false);
      });

      test('allows to choose different emails', async function (assert) {
        const { email, subject, description, submit } = helpPage.supportSection.form;
        let data = {};

        this.requestHandler = (request) => {
          data = JSON.parse(request.requestBody).request;
          return data;
        };

        await selectChoose(email.trigger.scope, this.user.emails[1]);

        await subject.fill(mockData.subject);
        await description.fill(mockData.description);

        await submit.click();
        await settled();

        assert.equal(data.requester.email, this.user.emails[1]);
      });
    });
  });
});
