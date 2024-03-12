import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { Response } from 'miragejs';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('RepositoryStatusToggleComponent', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  skip('it switches state when clicked', async function (assert) {
    this.set('repository', {
      id: 10000,
      name: 'foo-bar',
      owner: {
        login: 'foo',
        vcs_type: 'GithubRepository'
      },
      description: 'A foo repo',
      active: true,
      urlGithub: 'https://github.com/foo/foobar',
      slug: 'foo/foo-bar',
      permissions: {
        admin: false,
      },
    });

    await render(hbs`{{repository-status-toggle repository=this.repository}}`);

    assert.dom('.switch').hasClass('active', 'switch should have active class');
  });

  skip('should display correct error message on 409 fail', async function (assert) {
    let store = this.owner.lookup('service:store');
    let repo = store.push({
      data: {
        id: 10001,
        type: 'repo',
        vcs_type: 'GithubRepository',
        attributes: {
          slug: 'travis-ci/travis-web',
          active: false,
          permissions: {
            admin: true
          },
        }
      }
    });

    this.set('repository', repo);

    this.server.post('/repo/:id/activate', (schema, request) => new Response(409, {}, {}));

    await render(hbs`{{repository-status-toggle repository=this.repository}}`);
    assert.dom('.switch').findElement().click();

    await waitFor('.repositories-error', { timeout: 2000 });

    settled().then(() => {
      assert.dom('.repositories-error').includesText(
        'Request cannot be completed because the repository ssh key is still pending to be created. Please retry in a bit, or try syncing the repository if this condition does not resolve.'
      );
    });
  });

  skip('should display correct error message on non 409 fail', async function (assert) {
    let store = this.owner.lookup('service:store');
    let repo = store.push({
      data: {
        id: 10001,
        type: 'repo',
        attributes: {
          slug: 'travis-ci/travis-web',
          active: false,
          permissions: {
            admin: true
          },
        }
      }
    });

    this.set('repository', repo);

    this.server.post('/repo/:id/activate', (schema, request) => new Response(404, {}, {}));

    await render(hbs`{{repository-status-toggle repository=this.repository}}`);

    assert.dom('.switch').findElement().click();
    settled().then(() => {
      assert.dom('.repositories-error').includesText(
        'An error happened when we tried to alter settings on GitHub.'
      );
    });
  });
});
