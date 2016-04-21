import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('requests-item', 'Integration | Component | requests-item', {
  integration: true
});

test('it renders request data', function(assert) {
  var request, yesterday;
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
  this.set('request', request);
  this.render(hbs`{{requests-item request=request}}`);
  assert.equal(this.$('.row-item:nth-child(2) strong').text().trim(), 'dev');
  assert.equal(this.$('.row-item:nth-child(3) .label-align').text().trim(), 'a day ago');
  assert.ok(this.$('.status-icon').hasClass('accepted'), 'icon should have accepted class');
  assert.equal(this.$('.row-item:nth-child(4)').text().trim(), 'Bam!');
  assert.equal(this.$('.row-item:nth-child(4) .emoji').length, 1, 'there should be an emoji icon in commit message');
  return assert.equal(this.$('.row-item:nth-child(5)').text().trim(), '10', 'build number should be displayed');
});

test('it renders PR number if a request is a PR', function(assert) {
  var request = {
    id: 1,
    isPullRequest: true,
    pullRequestNumber: 20
  };
  this.set('request', request);
  this.render(hbs`{{requests-item request=request}}`);
  return assert.equal(this.$('.row-item:nth-child(2) strong').text().trim(), '#20');
});
