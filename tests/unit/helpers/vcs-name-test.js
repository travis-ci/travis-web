import vcsNameHelper from 'travis/helpers/vcs-name';
import { module, test } from 'qunit';

const vcsName = vcsNameHelper.compute;

module('Unit | Helper | vcs name', function () {
  test('it defaults to Github', function (assert) {
    assert.equal(vcsName([]), 'GitHub');
    assert.equal(vcsName([null]), 'GitHub');
    assert.equal(vcsName(['']), 'GitHub');
  });

  test('it handles Github', function (assert) {
    assert.equal(vcsName(['GithubAnything']), 'GitHub');
  });

  test('it handles Bitbucket', function (assert) {
    assert.equal(vcsName(['BitbucketAnything']), 'Bitbucket');
  });

  test('it returns null for invalid', function (assert) {
    assert.equal(vcsName(['OtherVcs']), null);
  });
});
