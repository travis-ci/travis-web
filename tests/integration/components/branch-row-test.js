import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | branch row', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders data correctly', async function (assert) {
    const repoObj = {
      id: 15038,
      name: 'php-test-staging',
      slug: 'travis-repos/php-test-staging',
      vcs_name: 'php-test-staging',
      owner_name: 'travis-repos',
      vcs_type: 'GithubRepository'
    };
    let store = this.owner.lookup('service:store');
    store.push({ data: { id: repoObj.id, type: 'repo', attributes: repoObj } });
    const branch = EmberObject.create({
      name: 'master',
      repository: repoObj,
      default_branch: true,
      exists_on_github: true,
      last_build: {
        id: 393177,
        number: '1',
        state: 'passed',
        duration: 22,
        event_type: 'push',
        previous_state: null,
        started_at: '2015-03-10T23:19:31Z',
        finished_at: '2015-03-10T23:19:45Z',
        created_by: {
          name: 'Dan Buch',
          avatar_url: 'https://0.gravatar.com/avatar/563fd372b4d51781853bc85147f06a36'
        },
        commit: {
          id: 160181,
          sha: 'a82f6ba76c7b729375ed6a1d7a26b765f694df12',
          ref: 'refs/heads/master',
          message: 'Add money example as hello world',
          compare_url: 'https://github.com/travis-repos/php-test-staging/compare/3d86ee98be2b...a82f6ba76c7b',
          committed_at: '2014-11-20T18:34:04Z',
          committer: {
            name: 'Dan Buch',
            avatar_url: 'https://0.gravatar.com/avatar/563fd372b4d51781853bc85147f06a36'
          },
          author: {
            name: 'Dan Buch',
            avatar_url: 'https://0.gravatar.com/avatar/563fd372b4d51781853bc85147f06a36'
          }
        }
      }
    });

    this.set('branch', branch);

    await render(hbs`{{branch-row branch=branch}}`);

    assert.dom('.branch-row').hasClass('passed', 'component should have state class (passed)');
    assert.dom('.row-name .label-align').hasText('master', 'should display correct branch name');
    assert.dom('.row-request .label-align').hasText('1 passed', 'should display build number and state');
    assert.dom('.row-commiter .label-align').hasText('Dan Buch', 'should display correct commiter name');
    assert.dom('.row-commit .inner-underline').hasText('a82f6ba', 'should display correct commit sha');
  });
});
