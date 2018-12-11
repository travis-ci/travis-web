import { module, test } from 'qunit';
import { settled } from '@ember/test-helpers';
import moment from 'moment';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import helpPage from 'travis/tests/pages/help';
import config from 'travis/config/environment';

import {
  UTC_START_TIME,
  UTC_END_TIME,
  DATE_FORMAT
} from 'travis/components/zendesk-request-form';

const { apiHost, createRequestEndpoint } = config.zendesk;

module('Acceptance | help page', function (hooks) {
  setupApplicationTest(hooks);

  module('for unauthorised user', function (hooks) {
    hooks.beforeEach(async function () {
      await helpPage.visit();
    });

    test('it has correct structure', function (assert) {
      const { greetingSection, supportSection } = helpPage;
      const { username, header, navigationLinks, status } = greetingSection;

      assert.ok(greetingSection.isPresent);
      assert.ok(header.isPresent);
      assert.ok(navigationLinks.isPresent);
      assert.ok(status.isPresent);
      assert.notOk(username.isPresent);

      assert.ok(supportSection.isPresent);
    });

    test('it shows log in stub', function (assert) {
      const { logInImage, logInButton } = helpPage.supportSection;

      assert.ok(logInImage.isPresent);
      assert.ok(logInButton.isPresent);
    });
  });

  module('for authorised user', function (hooks) {
    hooks.beforeEach(async function () {
      this.user = server.create('user');
      await signInUser(this.user);
      await helpPage.visit();
    });

    test('it has correct structure', function (assert) {
      const { greetingSection, supportSection } = helpPage;
      const { username, header, navigationLinks, status } = greetingSection;

      assert.ok(greetingSection.isPresent);
      assert.ok(header.isPresent);
      assert.ok(navigationLinks.isPresent);
      assert.ok(status.isPresent);
      assert.ok(username.isPresent);
      assert.equal(username.text, this.user.name);

      assert.ok(supportSection.isPresent);
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
        this.handler = (request) => JSON.parse(request.requestBody);
        server.post(`${apiHost}${createRequestEndpoint}`, (schema, request) => {
          return this.handler(request);
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
    });
  });
});
