import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { prettyDate } from 'travis/helpers/pretty-date';

module('Integration | Component | jobs item', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    let startedAt = new Date();
    const job = {
      id: 10,
      state: 'passed',
      number: '2',
      jobNumber: '2',
      config: {
        // this simulates a promise
        content: {
          rvm: '2.1.2',
          jdk: 'openjdk6',
          os: 'linux-ppc64le',
          env: 'TESTS=unit'
        },
      },
      duration: 100,
      startedAt,
      os: 'linux',
    };
    this.job = job;
    await render(hbs`{{jobs-item job=job}}`);

    assert.dom('.jobs-item').hasClass('passed', 'component should have a state class (passed)');
    assert.dom('.job-number .label-align').hasText('2', 'job number should be displayed');
    assert.dom('.job-lang').hasText('JDK: openjdk6 Ruby: 2.1.2', 'langauges list should be displayed');
    assert.dom('.job-env').hasText('TESTS=unit', 'env should be displayed');
    assert.dom('.job-os').hasClass('linux', 'OS class should be added for OS icon');
    assert.dom('.job-arch').hasText('ppc64le', 'arch should be displayed');
    assert.dom('.job-duration').hasText('1 min 40 sec', 'duration should be displayed');
    assert.dom('.job-duration').hasAttribute('title', `Started ${prettyDate([startedAt])}`);
  });

  test('outputs info on not set properties', async function (assert) {
    const job = {};
    this.job = job;
    await render(hbs`{{jobs-item job=job}}`);

    assert.dom('.job-env').hasText(/no environment variables set/, 'a message for no env vars should be displayed');
    assert.dom('.job-lang').hasText(/no language set/, 'a message about no language being set should be displayed');
  });

  test('when name is set it replaces both language and env', async function (assert) {
    const job = {
      id: 10,
      state: 'passed',
      number: '2',
      config: { content: {
        rvm: '2.1.2',
        name: 'that name'
      } },
      duration: 100
    };

    this.job = job;
    await render(hbs`{{jobs-item job=job}}`);

    assert.dom('.job-name .label-align').hasText('that name', 'name should be displayed');
    assert.dom('.job-language .label-align').doesNotExist();
    assert.dom('.job-env .label-align').doesNotExist();
  });

  test('when env is not set, gemfile is displayed in the env section', async function (assert) {
    const job = {
      id: 10,
      state: 'passed',
      number: '2',
      config: { content: {
        rvm: '2.1.2',
        gemfile: 'foo/Gemfile'
      } },
      duration: 100
    };

    this.job = job;
    await render(hbs`{{jobs-item job=job}}`);

    assert.dom('.job-lang .label-align').hasText('Ruby: 2.1.2', 'langauges list should be displayed');
    assert.dom('.job-env .label-align').hasText('Gemfile: foo/Gemfile', 'env should be displayed');
  });

  test('when env is set, gemfile is displayed in the language section', async function (assert) {
    const job = {
      id: 10,
      state: 'passed',
      number: '2',
      config: { content: {
        rvm: '2.1.2',
        gemfile: 'foo/Gemfile',
        env: 'FOO=bar'
      } },
      duration: 100
    };
    this.job = job;
    await render(hbs`{{jobs-item job=job}}`);

    assert.dom('.job-lang .label-align').hasText('Ruby: 2.1.2 Gemfile: foo/Gemfile', 'Gemfile should be displayed in languages section');
    assert.dom('.job-env .label-align').hasText('FOO=bar', 'env should be displayed');
  });
});
