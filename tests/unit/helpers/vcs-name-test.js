import vcsNameHelper from 'travis/helpers/vcs-name';
import { module, test } from 'qunit';

const vcsName = vcsNameHelper.compute;

module('Unit | Helper | vcs name', function () {
  test('it defaults to github vcs name', function (assert) {
    assert.equal(vcsName([]), 'GitHub');
  });

  test('it handles github vcs types', function (assert) {
    assert.equal(vcsName(['GithubAnything']), 'GitHub');
  });

  test('it handles bitbucket vcs types', function (assert) {
    assert.equal(vcsName(['BitbucketAnything']), 'Bitbucket');
  });

  test('it returns null for invalid vcs types', function (assert) {
    assert.equal(vcsName(['OtherVcs']), null);
  });
});
