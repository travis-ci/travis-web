import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('build-header', 'Integration | Component | build header', {
  integration: true
});

test('render api build', function (assert) {
  let repo = {
    slug: 'travis-ci/travis-web'
  };
  let commit = {
    compareUrl: 'https://github.com/travis-repos/php-test-staging/compare/3d86ee98be2b...a82f6ba76c7b',
    branch: 'feature-branch'
  };
  let build = {
    eventType: 'api',
    status: 'passed',
    number: '1234',
    commit: commit,
    repo: repo
  };

  this.set('build', build);
  this.set('repo', repo);
  this.set('commit', commit);

  this.render(hbs`{{build-header item=build repo=repo commit=commit}}`);

  assert.equal(this.$().find('.commit-compare').length, 0, 'does not display compare link element for api builds');
  assert.equal(this.$().find('.build-status span.icon').text().trim(), 'API event', 'displays right icon');
  assert.equal(this.$().find('.commit-branch-url').attr('href'), 'https://github.com/travis-ci/travis-web/tree/feature-branch', 'displays branch url');
  assert.equal(this.$().find('.commit-branch-url').text().trim(), 'Branch feature-branch', 'displays link to branch');
});


test('render push build', function (assert) {
  let commit = {
    compareUrl: 'https://github.com/travis-repos/php-test-staging/compare/3d86ee98be2b...a82f6ba76c7b'
  };
  let build = {
    eventType: 'push',
    status: 'passed',
    number: '1234',
    commit: commit,
    branchName: 'feature-2'
  };

  this.set('build', build);
  this.render(hbs`{{build-header item=build}}`);

  assert.equal(this.$().find('.commit-compare').length, 1, 'does display compare link element');
  assert.equal(this.$().find('.commit-compare').text().trim(), 'Compare 3d86ee9..a82f6ba', 'does display compare link for push builds');
});
