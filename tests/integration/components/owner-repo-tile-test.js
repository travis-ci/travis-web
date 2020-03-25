import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('OwnerRepoTileComponent', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const repo = EmberObject.create({
      slug: 'travis-ci/travis-chat',
      name: 'travis-chat',
      vcsName: 'travis-chat',
      ownerName: 'travis-ci',
      active: false,
      'private': false,
      shared: true,
      currentBuild: {
        number: '25',
        state: 'passed',
        duration: 252,
        eventType: 'push',
        previousState: 'passed',
        startedAt: '2013-07-08T11:03:19Z',
        finishedAt: '2013-07-08T11:06:50Z',
        commit: {
          sha: '16fff347ff55403caf44c53357855ebc32adf95d',
          compareUrl: 'https://github.com/travis-ci/travis-chat/compare/3c4e9ea50141...16fff347ff55'
        }
      },
      defaultBranch: {
        name: 'master',
        lastBuild: {
          number: '25',
          state: 'passed',
          duration: 252,
          event_type: 'push',
          previousState: 'passed',
          startedAt: '2013-07-08T11:03:19Z',
          finishedAt: '2013-07-08T11:06:50Z',
          commit: {
            sha: '16fff347ff55403caf44c53357855ebc32adf95d',
            compareUrl: 'https://github.com/travis-ci/travis-chat/compare/3c4e9ea50141...16fff347ff55'
          }
        }
      }
    });

    this.set('repo', repo);

    await render(hbs`{{owner-repo-tile repo=repo}}`);

    assert.dom('.owner-tile').hasClass('passed', 'component should have state class (passed)');
    assert.dom('.owner-tile-section:nth-of-type(1) span.repo-title-text').hasText('travis-chat', 'should display correct repo name');
    assert.dom('.owner-tile-section:nth-of-type(1) span.repo-title-text svg').hasClass('shared', 'should display correct repo share icon');
    assert.dom('.owner-tile-section:nth-of-type(2) span.label-align').hasText('25', 'should display correct build number');
    assert.dom('.owner-tile-section:nth-of-type(3) span.default-branch-name').hasText('master', 'should display branch name');
    assert.dom('.owner-tile-section:nth-of-type(4) span.commit-compare').hasText('16fff34', 'should display correct commit sha');
  });
});
