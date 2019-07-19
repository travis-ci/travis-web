import { module, test } from 'qunit';
import vcsLinks, { endpoints, vcsUrl } from 'travis/utils/vcs-links';

module('Unit | Utility | vcs-links', function () {
  const slug = 'user/repo';

  test('endpoints', function (assert) {
    assert.equal(endpoints.github, 'https://github.com');
    assert.equal(endpoints.bitbucket, 'https://bitbucket.org');
  });

  test('vcsUrl', function (assert) {
    const paths = {
      github: '/somepath',
      bitbucket: '/somepath',
    };

    assert.throws(vcsUrl, 'Throws if cannot find vcs');
    assert.throws(() => vcsUrl('Github'), 'Throws if cannot find path');

    assert.equal(vcsUrl(null, paths), 'https://github.com/somepath', 'Defaults to Github');
    assert.equal(vcsUrl('Github', paths), 'https://github.com/somepath');
    assert.equal(vcsUrl('Bitbucket', paths), 'https://bitbucket.org/somepath');
  });

  test('repoUrl', function (assert) {
    assert.equal(vcsLinks.repoUrl('Github', slug), `${endpoints.github}/${slug}`);
    assert.equal(vcsLinks.repoUrl('Bitbucket', slug), `${endpoints.bitbucket}/${slug}`);
  });

  test('branchUrl', function (assert) {
    const branch = 'branch';

    assert.equal(vcsLinks.branchUrl('Github', slug, branch), `${endpoints.github}/${slug}/tree/${branch}`);
    assert.equal(vcsLinks.branchUrl('Bitbucket', slug, branch), `${endpoints.bitbucket}/${slug}/src/${branch}`);
  });

  test('tagUrl', function (assert) {
    const tag = 'tag';

    assert.equal(vcsLinks.tagUrl('Github', slug, tag), `${endpoints.github}/${slug}/releases/tag/${tag}`);
    assert.equal(vcsLinks.tagUrl('Bitbucket', slug, tag), `${endpoints.bitbucket}/${slug}/src/${tag}`);
  });

  test('commitUrl', function (assert) {
    const sha = 'sha';

    assert.equal(vcsLinks.commitUrl('Github', slug, sha), `${endpoints.github}/${slug}/commit/${sha}`);
    assert.equal(vcsLinks.commitUrl('Bitbucket', slug, sha), `${endpoints.bitbucket}/${slug}/commits/${sha}`);
  });

  test('fileUrl', function (assert) {
    const branch = 'branch';
    const file = 'file';

    assert.equal(vcsLinks.fileUrl('Github', slug, branch, file), `${endpoints.github}/${slug}/blob/${branch}/${file}`);
    assert.equal(vcsLinks.fileUrl('Bitbucket', slug, branch, file), `${endpoints.bitbucket}/${slug}/src/${branch}/${file}`);
  });

  test('issueUrl', function (assert) {
    const issueNumber = '123';

    assert.equal(vcsLinks.issueUrl('Github', slug, issueNumber), `${endpoints.github}/${slug}/issues/${issueNumber}`);
    assert.equal(vcsLinks.issueUrl('Bitbucket', slug, issueNumber), `${endpoints.bitbucket}/${slug}/issues/${issueNumber}`);
  });

  test('profileUrl', function (assert) {
    const username = 'username';

    assert.equal(vcsLinks.profileUrl('Github', username), `${endpoints.github}/${username}`);
    assert.equal(vcsLinks.profileUrl('Bitbucket', username), `${endpoints.bitbucket}/${username}`);
  });

  test('appsActivationUrl', function (assert) {
    const vcsId = 'vcsId';
    const appName = 'appName';

    assert.equal(vcsLinks.appsActivationUrl('Github', appName, vcsId), `${endpoints.github}/apps/${appName}/installations/new/permissions?suggested_target_id=${vcsId}`);
    assert.equal(vcsLinks.appsActivationUrl('Bitbucket', appName, vcsId), `${endpoints.bitbucket}`);
  });
});
