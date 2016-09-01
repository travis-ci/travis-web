import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dashboard-row', 'Integration | Component | dashboard row', {
  integration: true
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
});
