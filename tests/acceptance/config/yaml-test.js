import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { percySnapshot } from 'ember-percy';
import signInUser from 'travis/tests/helpers/sign-in-user';
import page from 'travis/tests/pages/build';

let config = `
language: jortle
sudo: tortle
`;

let source = 'travis-ci/travis-project/.travis.yml@7e0d8414106de345';
let source2 = 'travis-ci/travis-project/.travis.yml@7e0d8414106de346';

let rawConfigs = [
  {
    config: config,
    source: source
  },
  {
    config: config,
    source: source
  },
  {
    config: config,
    source: source2
  }
];

module('Acceptance | config/yaml', function (hooks) {
  setupApplicationTest(hooks);

  // Shouldn’t be necessary, but without this, Mirage’s beta_features 403s.
  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);

    this.repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

    let branch = server.create('branch', { name: 'acceptance-tests' });
    this.request = server.create('request', { repository: this.repository, raw_configs: rawConfigs });
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
      assert.equal(page.yaml[0].text, 'language: jortle sudo: tortle');
      assert.equal(page.yaml[0].source, source);
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

      percySnapshot(assert);
    });

    test('hides the tab when no yaml is found', async function (assert) {
      this.request.raw_configs = [];

      await visit(`/travis-ci/travis-web/builds/${this.build.id}`);
      assert.ok(page.yamlTab.isDisabled, 'expected the config tab to be disabled when there’s no .travis.yml');
    });

    test('shows the job note when viewing a single job', async function (assert) {
      await visit(`/travis-ci/travis-web/jobs/${this.job.id}/config`);

      assert.ok(page.jobYamlNote.text, 'This is the configuration for all of build #5, including this job');
    });

    test('shows all unique raw configs', async function (assert) {
      await visit(`/travis-ci/travis-web/builds/${this.build.id}`);
      await page.yamlTab.click();
      assert.equal(page.yaml.length, 2, 'expected two yaml code block');
    });
  });

  module('with a single-job build', function () {
    test('shows yaml', async function (assert) {
      server.create('message', {
        request: this.request,
        level: 'warn',
        key: 'jortle'
      });

      await visit(`/travis-ci/travis-web/jobs/${this.job.id}`);
      await page.yamlTab.click();

      assert.ok(page.jobYamlNote.isHidden, 'expected the job note to be hidden for a single-job build');
      assert.equal(page.yaml[0].text, 'language: jortle sudo: tortle');
      assert.equal(page.yaml[0].source, source);
    });

    test('hides the tab when no yaml is found', async function (assert) {
      this.request.raw_configs = [];

      await visit(`/travis-ci/travis-web/jobs/${this.job.id}`);
      assert.ok(page.yamlTab.isDisabled, 'expected the config tab to be disabled when there’s no .travis.yml');
    });
  });
});
