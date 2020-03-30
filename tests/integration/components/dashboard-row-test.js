import EmberObject from '@ember/object';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
// import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

const ajaxStub = Service.extend({
  ajax() {
    // console.log('calling ....');
  }
});

module('Integration | Component | dashboard row', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:api', ajaxStub);
    this.api = this.owner.lookup('service:api');
  });

  test('it renders data correctly', async function (assert) {
    let oneYearAgo = new Date(new Date() - 1000 * 60 * 60 * 24 * 365);

    const repo = EmberObject.create({
      active: true,
      currentBuild: {
        branch: { name: 'some-branch' },
        commit: {
          sha: 'alsoshalolol',
          compareUrl: 'https://githubz.com/alsolol'
        },
        finishedAt: oneYearAgo.toISOString(),
        eventType: 'cron',
        number: 2,
        state: 'failed'
      },
      defaultBranch: {
        name: 'master',
        lastBuild: {
          id: 1919,
          number: 1,
          eventType: 'api',
          state: 'passed',
          finishedAt: '2016-08-01T15:22:21Z',
          commit: {
            sha: 'lololol',
            compareUrl: 'https://githubz.com/lol'
          }
        }
      },
      id: 1234,
      name: 'travis-web',
      vcs_name: 'travis-web',
      owner: {
        login: 'travis-ci'
      },
      owner_name: 'travis-ci',
      slug: 'travis-ci/travis-web',
      shared: true
    });

    this.set('repo', repo);
    await render(hbs`{{dashboard-row repo=repo}}`);

    assert.dom('.dash-header .row-label a').hasText('travis-ci');
    assert.dom('.dash-header .row-label a').hasAttribute('title', 'travis-ci');

    assert.dom('.dash-header .row-content a').hasText('travis-web');
    assert.dom('.dash-header .row-content a').hasAttribute('title', 'travis-web');
    assert.dom('.dash-header .row-content a svg').hasClass('shared', 'should display correct repo share icon');

    assert.dom('.dash-default').hasClass('passed', 'Indicates right state of default branch last build');
    assert.dom('.dash-last').hasClass('failed', 'Indicates right state of current build');

    assert.dom('.dash-finished .row-content').hasAttribute('title', oneYearAgo.toISOString());
    assert.dom('.dash-finished .label-align').hasText('about a year ago');

    assert.dom('.dash-default .row-content a').hasText('passed', 'Displays the default branch name state');
    assert.dom('.dash-last .row-content a').hasText('#2 failed', 'Displays the number and state of the current build');
  });
});
