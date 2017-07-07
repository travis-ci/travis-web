import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('owner-repo-tile', 'OwnerRepoTileComponent', {
  integration: true
});

test('it renders', function (assert) {
  const repo = Ember.Object.create({
    slug: 'travis-ci/travis-chat',
    active: false,
    'private': false,
    current_build: {
      number: '25',
      state: 'passed',
      duration: 252,
      event_type: 'push',
      previous_state: 'passed',
      started_at: '2013-07-08T11:03:19Z',
      finished_at: '2013-07-08T11:06:50Z',
      commit: {
        sha: '16fff347ff55403caf44c53357855ebc32adf95d',
        compare_url: 'https://github.com/travis-ci/travis-chat/compare/3c4e9ea50141...16fff347ff55'
      }
    },
    default_branch: {
      name: 'master',
      last_build: {
        number: '25',
        state: 'passed',
        duration: 252,
        event_type: 'push',
        previous_state: 'passed',
        started_at: '2013-07-08T11:03:19Z',
        finished_at: '2013-07-08T11:06:50Z',
        commit: {
          sha: '16fff347ff55403caf44c53357855ebc32adf95d',
          compare_url: 'https://github.com/travis-ci/travis-chat/compare/3c4e9ea50141...16fff347ff55'
        }
      }
    }
  });

  this.set('repo', repo);

  this.render(hbs`{{owner-repo-tile repo=repo}}`);

  assert.ok(this.$().find('.owner-tile').hasClass('passed'), 'component should have state class (passed)');
  assert.equal(this.$('.row-item:nth-of-type(1)').text().trim(), 'travis-chat', 'should display correct repo name');
  assert.equal(this.$('.row-item:nth-of-type(3) span.label-align').text().trim(), 'master', 'should display branch name');
  assert.equal(this.$('.row-item:nth-of-type(4)').text().trim(), '16fff34', 'should display correct commit sha');
});
