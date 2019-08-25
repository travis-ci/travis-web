import { vcsUrl, vcsName, vcsVocab, vcsIcon } from 'travis/utils/vcs';
import { module, test } from 'qunit';

module('Unit | Utils | vcsName', function () {
  test('it defaults to Github', function (assert) {
    assert.equal(vcsName(), 'GitHub');
    assert.equal(vcsName(null), 'GitHub');
    assert.equal(vcsName(''), 'GitHub');
  });

  test('it handles Github', function (assert) {
    assert.equal(vcsName('GithubAnything'), 'GitHub');
  });

  test('it handles Bitbucket', function (assert) {
    assert.equal(vcsName('BitbucketAnything'), 'Bitbucket');
  });

  test('it throws when vcs is not found in providers', function (assert) {
    assert.throws(() => vcsName('OtherVcs'));
  });
});

module('Unit | Utils | vcsVocab', function () {
  test('it returns the vocabulary key', function (assert) {
    assert.equal(vcsVocab('GithubRepo', 'pullRequest'), 'Pull Request');
    assert.equal(vcsVocab('AssemblaRepo', 'pullRequest'), 'Merge Request');
    assert.equal(vcsVocab('GithubRepo', 'organization'), 'Organization');
    assert.equal(vcsVocab('AssemblaRepo', 'organization'), 'Portfolio');
  });

  test('throws if key is invalid', function (assert) {
    assert.throws(() => vcsVocab('GithubRepo', 'unknownKey'));
  });
});

module('Unit | Utils | vcsIcon', function () {
  test('it returns the icon', function (assert) {
    assert.equal(vcsIcon('GithubRepo'), 'icon-repooctocat');
    assert.equal(vcsIcon('AssemblaRepo'), 'icon-assembla');
  });
});

module('Unit | Utils | vcsUrl', function () {
  test('it returns the formatted URL', function (assert) {
    assert.equal(
      vcsUrl('branch', 'GithubRepo', { owner: 'theowner', repo: 'therepo', branch: 'thebranch' }),
      'https://github.com/theowner/therepo/src/thebranch'
    );
  });

  test('throws if any param is missing', function (assert) {
    assert.throws(() => vcsUrl('branch', 'GithubRepo', { owner: 'owner', repo: 'repo' }));
  });
});
