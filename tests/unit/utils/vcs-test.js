import { vcsUrl, vcsConfig, vcsVocab, vcsIcon, availableProviders } from 'travis/utils/vcs';
import { module, test } from 'qunit';

const vcsName = (vcsType) => vcsConfig(vcsType).name;

module('Unit | Utils | vcsName', function () {
  test('it defaults to Github', function (assert) {
    assert.equal(vcsName(), 'GitHub');
    assert.equal(vcsName(null), 'GitHub');
    assert.equal(vcsName(''), 'GitHub');
  });

  test('it handles Github', function (assert) {
    assert.equal(vcsName('GithubRepository'), 'GitHub');
  });

  test('it handles Bitbucket', function (assert) {
    assert.equal(vcsName('BitbucketRepository'), 'Bitbucket');
  });

  test('it returns default provider when vcs is not found in providers', function (assert) {
    assert.equal(vcsName('OtherVcs'), 'GitHub');
  });
});

module('Unit | Utils | vcsVocab', function () {
  test('it returns the vocabulary key', function (assert) {
    assert.equal(vcsVocab('GithubRepository', 'pullRequest'), 'Pull Request');
    assert.equal(vcsVocab('AssemblaRepository', 'pullRequest'), 'Merge Request');
    assert.equal(vcsVocab('GithubRepository', 'organization'), 'Organization');
    assert.equal(vcsVocab('AssemblaRepository', 'organization'), 'Space');
  });

  test('throws if key is invalid', function (assert) {
    assert.throws(() => vcsVocab('GithubRepository', 'unknownKey'));
  });
});

module('Unit | Utils | vcsIcon', function () {
  test('it returns the icon', function (assert) {
    assert.equal(vcsIcon('GithubRepository'), 'icon-repooctocat');
    assert.equal(vcsIcon('AssemblaRepository'), 'icon-assembla');
  });
});

module('Unit | Utils | vcsUrl', function () {
  test('it returns the formatted URL', function (assert) {
    assert.equal(
      vcsUrl('branch', 'GithubRepository', { owner: 'theowner', repo: 'therepo', branch: 'thebranch' }),
      'https://github.com/theowner/therepo/tree/thebranch'
    );
  });

  test('throws if any param is missing', function (assert) {
    assert.throws(() => vcsUrl('branch', 'GithubRepository', { owner: 'owner', repo: 'repo' }));
  });
});

module('Unit | Utils | availableProviders', function () {
  test('returns the list of providers', function (assert) {
    assert.deepEqual(availableProviders, ['assembla', 'bitbucket', 'gitlab', 'github']);
  });
});
