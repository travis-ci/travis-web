import { visit } from '@ember/test-helpers';
import { Logger, Test } from 'ember';
import { module, test } from 'qunit';
import { setupApplicationTestCustom } from 'travis/tests/helpers/setup-application-test';
import buildPage from 'travis/tests/pages/build';
import { setupMirage } from 'ember-cli-mirage/test-support';

let adapterException;
let loggerError;

module('Acceptance | builds/invalid build', function (hooks) {
  setupApplicationTestCustom(hooks);
  setupMirage(hooks);


  test('viewing invalid build shows error', async function (assert) {
    // create incorrect repository as this is resolved first, errors otherwise
    this.server.create('repository', { slug: 'travis-ci/travis-api', owner: { login: 'travis-ci', id: 1} });

    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1} });
    const incorrectSlug = 'travis-ci/travis-api';
    const build = this.server.create('build', { repository });
    await visit(`${incorrectSlug}/builds/${build.id}`);

    assert.equal(buildPage.buildNotFoundMessage, 'Oops, we couldn\'t find that build!', 'Shows missing build message');
  });
});
