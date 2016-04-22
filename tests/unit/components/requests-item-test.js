import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('requests-item', {
  needs: ['helper:format-message', 'helper:format-time', 'helper:github-commit-link', 'component:status-icon', 'component:request-icon']
});

test('it renders request data', function(assert) {
  var component, request, yesterday;
  yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  request = {
    id: 1,
    branchName: 'dev',
    commit: {
      sha: 'abcdef123',
      message: 'Bam! :bomb:'
    },
    repo: {
      slug: 'travis-ci/travis-ci'
    },
    build: {
      number: 10
    },
    created_at: yesterday,
    isAccepted: true
  };
  component = this.subject({
    request: request
  });
  this.render();
  assert.equal(component.$('.row-item:nth-child(2) strong').text().trim(), 'dev');
  assert.equal(component.$('.row-item:nth-child(3) .label-align').text().trim(), 'a day ago');
  assert.ok(component.$('.status-icon').hasClass('accepted'), 'icon should have accepted class');
  assert.equal(component.$('.row-item:nth-child(4)').text().trim(), 'Bam!');
  assert.equal(component.$('.row-item:nth-child(4) .emoji').length, 1, 'there should be an emoji icon in commit message');
  return assert.equal(component.$('.row-item:nth-child(5)').text().trim(), '10', 'build number should be displayed');
});

test('it renders PR number if a request is a PR', function(assert) {
  var component, request;
  request = {
    id: 1,
    isPullRequest: true,
    pullRequestNumber: 20
  };
  component = this.subject({
    request: request
  });
  this.render();
  return assert.equal(component.$('.row-item:nth-child(2) strong').text().trim(), '#20');
});
