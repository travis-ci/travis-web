import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('build-header', 'Integration | Component | build header', {
  integration: true
});

test('render api build', function (assert) {
  let repo = { slug: 'travis-ci/travis-web' };
  let commit = {
    compareUrl: 'https://github.com/travis-repos/php-test-staging/compare/3d86ee98be2b...a82f6ba76c7b',
    subject: 'Endless joy'
  };
  let branch = {
    name: 'feature-branch',
  };
  let build = {
    eventType: 'api',
    status: 'passed',
    number: '1234',
    commit: commit,
    repo: repo,
    branch: branch,
    branchName: 'feature-branch',
    startedAt: new Date('January 15, 2018 12:28:49'),
    finishedAt: new Date('January 15, 2018 12:35:49'),
    isFinished: true,
  };

  this.set('build', build);
  this.set('repo', repo);
  this.set('commit', commit);

  this.render(hbs`{{build-header item=build repo=repo commit=commit}}`);

  assert.equal(this.$().find('.commit-compare').length, 0, 'does not display compare link element for api builds');
  assert.equal(this.$().find('.build-status .inner-underline').text().trim(), '#1234', 'displays build number');
  assert.equal(this.$().find('.commit-branch-url').attr('href'), 'https://github.com/travis-ci/travis-web/tree/feature-branch', 'displays branch url');
  assert.equal(this.$().find('.commit-branch-url span').text().trim(), 'Branch feature-branch', 'displays link to branch');
  assert.ok(this.$().find('.build-title').text().match(/Endless joy/), 'displays commit message');
  assert.equal(this.$().find('.commit-stopwatch').attr('title'), 'Started January 15, 2018 12:28:49');
  assert.ok(this.$().find('.commit-calendar').length, 'displays a calendar after the job is passed');
  assert.equal(this.$().find('.commit-calendar').attr('title'), 'Finished January 15, 2018 12:35:49');
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

  assert.equal(this.$().find('.build-status svg title').text(), 'Push event', 'displays push icon');
  assert.equal(this.$().find('.commit-compare').length, 1, 'does display compare link element');
  assert.equal(this.$().find('.commit-compare').text().trim(), 'Compare 3d86ee9..a82f6ba', 'does display compare link for push builds');
});

test('render cron build', function (assert) {
  let commit = {
    subject: 'Just complete and utter joy',
    branch: 'a-cron-branch-of-utter-joy'
  };
  let build = {
    eventType: 'cron',
    commit,
    branchName: 'a-cron-branch-of-utter-joy'
  };

  this.set('build', build);
  this.render(hbs`{{build-header item=build commit=build.commit}}`);

  assert.equal(this.$().find('.build-status svg title').text(), 'Cron job event');
  assert.ok(this.$().find('.build-title').text().match(/cron Just complete and utter joy/), 'displays cron before commit message');
});


test('render tag build', function (assert) {
  let commit = {
    subject: 'Just complete and utter joy',
    branch: { name: 'v1.0.0' }
  };
  let build = {
    eventType: 'push',
    commit,
    branch: { name: 'v1.0.0' },
    tag: { name: 'v1.0.0' },
    isTag: true
  };

  this.set('build', build);
  this.render(hbs`{{build-header item=build commit=build.commit}}`);

  assert.equal(this.$().find('.build-status svg title').text(), 'Tag');
  assert.equal(this.$().find('.build-title .commit-branch').text().trim(), 'v1.0.0', 'displays tag name in title');
  assert.ok(this.$().find('.commit-branch-url').text().match(/Tag v1.0.0/), 'displays link to tag on GH');
  assert.ok(this.$().find('.commit-branch-url').attr('href').match(/releases\/tag\/v1.0.0/), 'url is correct');
});

test('if a build is shown, only show elapsed time while running', function (assert) {
  let build = {
    eventType: 'push',
    status: 'running',
    number: '1234'
  };

  this.set('build', build);
  this.render(hbs`{{build-header item=build}}`);
  assert.equal(this.$().find('.commit-calendar').length, 0, 'does not display calendar while running');
  assert.equal(this.$().find('.commit-clock').length, 0, 'does not display elapsed time');
});

test('if a job is shown, only show elapsed time while running', function (assert) {
  let job = {
    eventType: 'push',
    status: 'running',
    number: '1234.1',
    build: {
      id: 123
    }
  };

  this.set('job', job);
  this.render(hbs`{{build-header item=job}}`);
  assert.equal(this.$().find('.commit-stopwatch').length, 1, 'does display elapsed time');
  assert.equal(this.$().find('.commit-stopwatch').text().trim(), 'Running for', 'Says running for');
  assert.equal(this.$().find('.commit-calendar').length, 0, 'does not display calendar while running');
});
