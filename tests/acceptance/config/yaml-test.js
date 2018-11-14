import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { percySnapshot } from 'ember-percy';
import signInUser from 'travis/tests/helpers/sign-in-user';
import page from 'travis/tests/pages/build';

let yaml = `
language: jortle
sudo: tortle
`;

module('Acceptance | config/yaml', function (hooks) {
  setupApplicationTest(hooks);

  // FIXME why is it necessary to be signed in?
  // But without this, Mirage’s beta_features 403s.
  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);

    this.repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

    let branch = server.create('branch', { name: 'acceptance-tests' });
    this.request = server.create('request', { repository: this.repository, yaml_config: yaml });
    this.build = server.create('build', { number: '5', state: 'started', repository: this.repository, branch, request: this.request });
    this.job = server.create('job', { number: '1234.1', state: 'received', build: this.build, repository: this.repository, config: { language: 'Hello' } });
  });

  module('with a multi-job build', function (hooks) {
    hooks.beforeEach(function () {
      server.create('job', { number: '1234.2', state: 'received', build: this.build, repository: this.repository, config: { language: 'Hello' } });
    });

    test('renders build yaml', async function (assert) {
      await visit(`/travis-ci/travis-web/builds/${this.build.id}`);

      assert.equal(document.title, `Build #${this.build.number} - travis-ci/travis-web - Travis CI`);
      await page.yamlTab.click();

      assert.equal(document.title, `Config - Build #${this.build.number} - travis-ci/travis-web - Travis CI`);
      assert.equal(page.yaml, 'language: jortle sudo: tortle');

      percySnapshot(assert);
    });

    test('shows build messages when they exist', async function (assert) {
      server.create('message', {
        request: this.request,
        level: 'warn',
        key: 'jortleby',
        code: 'skortleby',
        args: {
          jortle: 'tortle'
        }
      });

      server.create('message', {
        request: this.request,
        level: 'warn',
        key: 'language',
        code: 'cast',
        args: {
          given_value: 'tortle',
          given_type: 'str',
          value: true,
          type: 'bool'
        }
      });

      await visit(`/travis-ci/travis-web/builds/${this.build.id}`);
      await page.yamlTab.click();

      assert.equal(page.ymlMessages.length, 2, 'expected two yml messages');

      page.ymlMessages[0].as(message => {
        assert.ok(message.icon.isWarning, 'expected the yml message to be a warn');
        assert.equal(message.message, 'unrecognised message code skortleby');
      });
    });
  });

  module('with a single-job build', function () {
    test('shows yaml', async function (assert) {
      server.create('message', {
        request: this.request,
        key: 'jortle'
      });

      await visit(`/travis-ci/travis-web/jobs/${this.job.id}`);
      await page.yamlTab.click();

      assert.ok(page.jobYamlNote.isPresent, 'expected a note about the yml applying to the build to display');
      assert.equal(page.yaml, 'language: jortle sudo: tortle');
    });
  });
});
