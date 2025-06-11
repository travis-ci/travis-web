import { module, test } from 'qunit';
import { visit, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | builds/scroll', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {login: 'travis-ci'});
    signInUser(currentUser);
    this.server.create('allowance', {subscription_type: 1});
  });

  test('scrolling to the end of log', async function (assert) {
    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web', private: true, owner: { login: 'travis-ci', id: 1} });

    this.server.create('branch', {});

    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { number: '5', repository, state: 'passed', commit });
    let job = this.server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });

    let logLines = [];
    for (let i = 0; i < 99; i++) {
      logLines.push(`Log line no ${i}`);
    }

    this.server.create('log', { id: job.id, content: logLines.join('\n') });


    await visit(`/travis-ci/travis-web/builds/${build.id}`);


    await settled();
    assert.dom('[data-test-scroll-to-bottom]').exists();
    assert.dom('[data-test-scroll-to-top]').doesNotExist();
    assert.dom('[data-test-remove-log]').exists();
    assert.dom('[data-test-raw-log]').exists();

    const testContainer = document.getElementById('ember-testing-container');
    testContainer.scrollTop = testContainer.scrollHeight;
    testContainer.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    await settled();

    assert.dom('[data-test-scroll-to-bottom]').doesNotExist();
    assert.dom('[data-test-scroll-to-top]').exists();
    assert.dom('[data-test-remove-log]').doesNotExist();
    assert.dom('[data-test-raw-log]').doesNotExist();
  });
});
