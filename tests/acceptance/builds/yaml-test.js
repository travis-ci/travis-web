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
  });

  test('renders build yaml', async function (assert) {
    let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

    let branch = server.create('branch', { name: 'acceptance-tests' });
    let build = server.create('build', { number: '5', state: 'started', repository, branch, yaml });
    server.create('job', { number: '1234.1', state: 'received', build, repository, config: { language: 'Hello' } });
    server.create('job', { number: '1234.2', state: 'received', build, repository, config: { language: 'Hello' } });

    await visit(`/travis-ci/travis-web/builds/${build.id}`);

    // assert.equal(document.title, 'FIXME - travis-ci/travis-web - Travis CI');
    assert.equal(page.yaml, 'language: jortle\nsudo: tortle');

    percySnapshot(assert);
  });
});
