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

  test('it renders default log theme (dark)', async function (assert) {
    this.owner.register('service:log-theme', logThemeDark);

    const { owner } = getContext();
    const store = owner.lookup('service:store');
    const repository = store.createRecord('repo');
    const job = this.set('job', store.createRecord('job', { repo: repository }));

    await render(hbs`{{log-content job=job}}`);

    assert.dom('[data-test-log-content-container]').hasClass('log');
    assert.dom('[data-test-log-content-header]').hasClass('log-header');
    assert.dom('[data-test-log-content-download-log-button]').hasClass('download-log-button');
    assert.dom('[data-test-log-content-log-body]').hasClass('log-body');
  });

  test('it modifies elements with `light-theme` class when active', async function (assert) {
    this.owner.register('service:log-theme', logThemeLight);

    const { owner } = getContext();
    const store = owner.lookup('service:store');
    const repository = store.createRecord('repo');
    const job = this.set('job', store.createRecord('job', { repo: repository }));

    await render(hbs`{{log-content job=job}}`);

    assert.dom('[data-test-log-content-container]').hasClass('light-theme');
    assert.dom('[data-test-log-content-header]').hasClass('light-theme');
    assert.dom('[data-test-log-content-download-log-button]').hasClass('light-theme');
    assert.dom('[data-test-log-content-log-body]').hasClass('light-theme');
  });
});
