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
    const repo = EmberObject.create({
      active: true,
      currentBuild: {
        branch: { name: 'some-branch' },
        commit: {
          sha: 'alsoshalolol',
          compareUrl: 'https://githubz.com/alsolol'
        },
        finishedAt: '2016-09-01T15:22:21Z',
        eventType: 'cron',
        number: 2,
        state: 'failed'
      },
      defaultBranch: {
        name: 'master',
        lastBuild: {
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
      owner: {
        login: 'travis-ci'
      },
      slug: 'travis-ci/travis-web'
    });

    this.set('repo', repo);
    await render(hbs`{{dashboard-row repo=repo}}`);

    assert.dom('.dash-default').hasClass('passed', 'Indicates right state of default branch last build');
    assert.dom('.dash-last').hasClass('failed', 'Indicates right state of current build');
    // TODO: Remove this
    // assert.dom('.dash-default .row-content a').text().trim(), 'master passed', 'Displays the default branch name and state');
    assert.dom('.dash-last .row-content a').hasText('#2 failed', 'Displays the number and state of the current build');

    // TODO: Clarify what coverage is missing here.
    // this.$('.dropup-list a:first-of-type').click();

    // wait().then(() => {
    // });
  });
});
