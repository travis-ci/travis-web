import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
// import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

const ajaxStub = Ember.Service.extend({
  ajax() {
    // console.log('calling ....');
  }
});

moduleForComponent('dashboard-row', 'Integration | Component | dashboard row', {
  integration: true,
  beforeEach() {
    this.register('service:ajax', ajaxStub);
    this.inject.service('ajax', { as: 'ajax' });
  }
});

test('it renders data correctly', function () {
  const repo = Ember.Object.create({
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
  this.render(hbs`{{dashboard-row repo=repo}}`);

  ok(this.$().find('.dash-default').hasClass('passed'), 'Indicates right state of default branch last build');
  ok(this.$().find('.dash-last').hasClass('failed'), 'Indicates right state of current build');
  // equal(this.$().find('.dash-default .row-content a').text().trim(), 'master passed', 'Displays the default branch name and state');
  equal(this.$().find('.dash-last .row-content a').text().trim(), '#2 failed', 'Displays the number and state of the current build');

  // this.$('.dropup-list a:first-of-type').click();

  // wait().then(() => {
  // });
});
