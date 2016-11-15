import { githubBranch } from 'travis/utils/urls';

const { test, module } = QUnit;

module('urls');

test('GitHub branch url', function (assert) {
  assert.equal(githubBranch('travis-ci/travis-web', 'feature-branch'), 'https://github.com/travis-ci/travis-web/tree/feature-branch', 'generates link to branch on GitHub');
});
