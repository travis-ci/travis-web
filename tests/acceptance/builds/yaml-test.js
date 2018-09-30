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

module('Acceptance | builds/yaml', function (hooks) {
  setupApplicationTest(hooks);

  // FIXME why is it necessary to be signed in?
  // But without this, Mirage’s beta_features 403s.
  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);

    let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

    let branch = server.create('branch', { name: 'acceptance-tests' });
    this.request = server.create('request', { yaml_config: yaml });
    this.build = server.create('build', { number: '5', state: 'started', repository, branch, request: this.request });
    server.create('job', { number: '1234.1', state: 'received', build: this.build, repository, config: { language: 'Hello' } });
    server.create('job', { number: '1234.2', state: 'received', build: this.build, repository, config: { language: 'Hello' } });
  });

  test('renders build yaml', async function (assert) {
    await visit(`/travis-ci/travis-web/builds/${this.build.id}`);

    assert.ok(page.yamlTab.badge.isHidden, 'expected no badge when no build messages exist');

    // assert.equal(document.title, 'FIXME - travis-ci/travis-web - Travis CI');
    await page.yamlTab.click();

    assert.equal(page.yaml, 'language: jortle sudo: tortle');

    percySnapshot(assert);
  });

  test('also shows a badge and build messages when they exist', async function (assert) {
    server.create('message', {
      request: this.request,
      level: 'info',
      key: 'jortleby',
      code: 'skortleby',
      args: {
        jortle: 'tortle'
      }
    });

    await visit(`/travis-ci/travis-web/builds/${this.build.id}`);

    assert.ok(page.yamlTab.badge.isVisible, 'expected a badge when a message exists');
    assert.equal(page.yamlTab.badge.text, '1');

    await page.yamlTab.click();

    assert.equal(page.ymlMessages.length, 1, 'expected one yml message');

    page.ymlMessages[0].as(info => {
      assert.ok(info.icon.isInfo, 'expected the yml message to be an info');
      assert.equal(info.message, 'unrecognised message code skortleby');
    });
  });
});
