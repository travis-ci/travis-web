import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | build header', function (hooks) {
  setupRenderingTest(hooks);

  test('render api build', async function (assert) {
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

    await render(hbs`{{build-header item=build repo=repo commit=commit}}`);

    assert.dom('.commit-compare').doesNotExist('does not display compare link element for api builds');
    assert.dom('.build-status .inner-underline').hasText('#1234', 'displays build number');
    assert.dom('.commit-branch-url').hasAttribute('href', 'https://github.com/travis-ci/travis-web/tree/feature-branch', 'displays branch url');
    assert.dom('.commit-branch-url span').hasText('Branch feature-branch', 'displays link to branch');
    assert.dom('.build-title').hasText(/Endless joy/, 'displays commit message');
    assert.dom('.commit-stopwatch').hasAttribute('title', 'Started January 15, 2018 12:28:49');
    assert.dom('.commit-calendar').exists('displays a calendar after the job is passed');
    assert.dom('.commit-calendar').hasAttribute('title', 'Finished January 15, 2018 12:35:49');
  });

  test('render push build', async function (assert) {
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
    await render(hbs`{{build-header item=build}}`);

    assert.dom('.build-status svg title').hasText('Push event', 'displays push icon');
    assert.dom('.commit-compare').exists('does display compare link element');
    assert.dom('.commit-compare').hasText('Compare 3d86ee9..a82f6ba', 'does display compare link for push builds');
  });

  test('render cron build', async function (assert) {
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
    await render(hbs`{{build-header item=build commit=build.commit}}`);

    assert.dom('.build-status svg title').hasText('Cron job event');
    assert.dom('.build-title').hasText(/cron Just complete and utter joy/, 'displays cron before commit message');
  });


  test('render tag build', async function (assert) {
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
    await render(hbs`{{build-header item=build commit=build.commit}}`);

    assert.dom('.build-status svg title').hasText('Tag');
    assert.dom('.build-title .commit-branch').hasText('v1.0.0', 'displays tag name in title');
    assert.dom('.commit-branch-url').hasText(/Tag v1.0.0/, 'displays link to tag on GH');
    assert.dom('.commit-branch-url').hasAttribute('href', /releases\/tag\/v1.0.0/, 'url is correct');
  });

  test('if a build is shown, only show elapsed time while running', async function (assert) {
    let build = {
      eventType: 'push',
      status: 'running',
      number: '1234'
    };

    this.set('build', build);
    await render(hbs`{{build-header item=build}}`);
    assert.dom('.commit-stopwatch').exists('displays running time');
    assert.dom('.commit-calendar').doesNotExist('does not display calendar while running');
    assert.dom('.commit-clock').doesNotExist('does not display elapsed time');
  });

  test('if a job is shown, only show elapsed time while running', async function (assert) {
    let job = {
      eventType: 'push',
      status: 'running',
      number: '1234.1',
      build: {
        id: 123
      }
    };

    this.set('job', job);
    await render(hbs`{{build-header item=job}}`);
    assert.dom('.commit-stopwatch').exists('does display elapsed time');
    assert.dom('.commit-stopwatch').hasText('Running for -', 'Says running for');
    assert.dom('.commit-calendar').doesNotExist('does not display calendar while running');
  });
});
