import vcsNameHelper from 'travis/helpers/vcs-name';
import { module, test } from 'qunit';

const vcsName = vcsNameHelper.compute;

module('Unit | Helper | vcs name', function () {
  test('it returns vcs name', function (assert) {
    assert.equal(vcsName(['GithubRepository']), 'GitHub');
    assert.equal(vcsName([]), 'GitHub');
    assert.equal(vcsName(['OtherVcsRepository']), null);
  });
});
