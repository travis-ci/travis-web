import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  getContext,
} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

module('Integration | Component | log-content', function (hooks) {
  setupRenderingTest(hooks);

  const logThemeDark = Service.extend({ theme: 'dark' });
  const logThemeLight = Service.extend({ theme: 'light' });

  test('it renders filler content when job not yet started', async function (assert) {
    const { owner } = getContext();
    const store = owner.lookup('service:store');
    const repository = store.createRecord('repo');
    const job = this.set('job',
      store.createRecord('job', {
        repo: repository,
        state: 'queued',
      })
    );

    await render(hbs`{{log-content job=job}}`);

    assert.dom('[data-test-log-content-job-not-started-notice]').exists();
  });
});
