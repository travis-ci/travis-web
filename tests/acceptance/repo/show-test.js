import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/repo/show';

moduleForAcceptance('Acceptance | show repo page', {
  beforeEach() {
    const repository = server.create('repository', {
      name: 'living-a-feminist-life',
      slug: 'killjoys/living-a-feminist-life'
    });

    repository.createBranch({
      name: 'feminist#yes',
      id: '/v3/repo/${repository.id}/branch/feminist#yes',
      default_branch: true
    });

    repository.createBranch({
      name: 'patriarchy#no',
      id: '/v3/repo/${repository.id}/branch/patriarchy#no',
      default_branch: false
    });
  }
});

test('loading branches doesnt update the default branch on the repo', function (assert) {
  server.logging = true;
  page.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });
  page.openStatusImagePopup();

  andThen(() => {
    const url = new URL(page.statusBadgeImageSrc);
    const expectedPath = `${url.pathname}?${url.searchParams}`;
    assert.equal(expectedPath, '/killjoys/living-a-feminist-life.svg?branch=feminist%23yes');
  });
});
