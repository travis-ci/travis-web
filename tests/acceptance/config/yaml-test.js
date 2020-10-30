import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { percySnapshot } from 'ember-percy';
import signInUser from 'travis/tests/helpers/sign-in-user';
import page from 'travis/tests/pages/build';
import { codeblockName } from 'travis/utils/format-config';
import { setupMirage } from 'ember-cli-mirage/test-support';

let slug = 'travis-ci/travis-web';

let config = `
language: jortle
sudo: tortle
`;

let source = `${slug}/.travis.yml@7e0d8414106de345`;
let source2 = `${slug}/.travis.yml@7e0d8414106de346`;

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
  setupMirage(hooks);

  // Shouldn’t be necessary, but without this, Mirage’s beta_features 403s.
  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    signInUser(currentUser);

    this.repository =  this.server.create('repository', { slug: slug, owner: { login: 'travis-ci', id: 1} });
    this.server.create('setting', {
      repository: this.repository,
      name: 'config_validation',
      value: true
    });

    let branch = this.server.create('branch', { name: 'acceptance-tests' });
    this.request = this.server.create('request', { repository: this.repository, raw_configs: rawConfigs });
    this.build = this.server.create('build', { number: '5', state: 'started', repository: this.repository, branch, request: this.request });
    this.job = this.server.create('job', { number: '1234.1', state: 'received', build: this.build, repository: this.repository, config: { language: 'Hello' } });
  });

  module('with a multi-job build', function (hooks) {
    hooks.beforeEach(function () {
      this.server.create('job', { number: '1234.2', state: 'received', build: this.build, repository: this.repository, config: { language: 'Hello' } });
    });

    test('renders build yaml', async function (assert) {
      await visit(`/travis-ci/travis-web/builds/${this.build.id}`);

      assert.equal(document.title, `Build #${this.build.number} - travis-ci/travis-web - Travis CI`);
      await page.yamlTab.click();

      assert.equal(document.title, `Config - Build #${this.build.number} - travis-ci/travis-web - Travis CI`);
      assert.equal(page.yaml[0].codeblock.text, 'language: jortle sudo: tortle');
      assert.equal(page.yaml[0].source, '.travis.yml');
      assert.equal(page.yaml[0].codeblock.id, codeblockName(source));
    });

    test('shows build messages when they exist', async function (assert) {
      const msg1 = this.server.create('message', {
        request: this.request,
        level: 'warn',
        key: 'jortleby',
        code: 'skortleby',
        args: {
          jortle: 'tortle'
        },
        src: source,
        line: 2,
      });

      this.server.create('message', {
        request: this.request,
        level: 'warn',
        key: 'language',
        code: 'cast',
        args: {
          given_value: 'tortle',
          given_type: 'str',
          value: true,
          type: 'bool'
        },
        src: source2,
      });

      await visit(`/travis-ci/travis-web/builds/${this.build.id}`);
      await page.yamlTab.click();
      await page.yamlMessagesHeader.click();

      assert.equal(page.ymlMessages.length, 2, 'expected two yml messages');

      page.ymlMessages[0].as(message => {
        assert.ok(message.icon.isWarning, 'expected the yml message to be a warn');
        assert.equal(message.message, 'unrecognised message code skortleby');
        assert.equal(page.yaml[0].codeblock.id, codeblockName(msg1.src));
        assert.equal(message.link.href, `#${codeblockName(msg1.src)}.${msg1.line + 1}`);
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
      assert.equal(page.yaml.length, 3, 'expected three yaml code block');
    });

    test('shows only file name for travis yml', async function (assert) {
      let source = 'travis-ci/travis-project/.travis.yml@7e0d8414106de345';
      this.request.raw_configs = [{
        config: config,
        source: source
      }];
      await visit(`/travis-ci/travis-web/builds/${this.build.id}`);
      await page.yamlTab.click();
      assert.equal(page.yaml[0].source, '.travis.yml');
    });

    test('shows internal path with sha', async function (assert) {
      let source = './internal/config.yml@7e0d8414106de345';
      this.request.raw_configs = [{
        config: config,
        source: source
      }];
      await visit(`/travis-ci/travis-web/builds/${this.build.id}`);
      await page.yamlTab.click();
      assert.equal(page.yaml[0].source, './internal/config.yml@7e0d841');
    });

    test('shows external path with formatted sha', async function (assert) {
      let source = `${slug}/some_path/config.yml@7e0d8414106de345`;
      this.request.raw_configs = [{
        config: config,
        source: source
      }];
      await visit(`/travis-ci/travis-web/builds/${this.build.id}`);
      await page.yamlTab.click();
      assert.equal(page.yaml[0].source, 'some_path/config.yml@7e0d841');
    });
  });

  module('with a single-job build', function () {
    test('shows yaml', async function (assert) {
      this.server.create('message', {
        request: this.request,
        level: 'warn',
        key: 'jortle'
      });

      await visit(`/travis-ci/travis-web/jobs/${this.job.id}`);
      await page.yamlTab.click();

      assert.ok(page.jobYamlNote.isHidden, 'expected the job note to be hidden for a single-job build');
      assert.equal(page.yaml[0].codeblock.text, 'language: jortle sudo: tortle');
      assert.equal(page.yaml[0].source, '.travis.yml');
    });

    test('hides the tab when no yaml is found', async function (assert) {
      this.request.raw_configs = [];

      await visit(`/travis-ci/travis-web/jobs/${this.job.id}`);
      assert.ok(page.yamlTab.isDisabled, 'expected the config tab to be disabled when there’s no .travis.yml');
    });
  });
});
