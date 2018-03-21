import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | jobs list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a list of jobs', async function(assert) {
    const jobs = {
      jobs: [
        {
          id: 1,
          state: 'passed'
        }, {
          id: 2,
          state: 'failed'
        }
      ],
      required: true
    };
    this.jobs = jobs;
    await render(hbs`{{jobs-list jobs=jobs.jobs required=jobs.required}}`);

    assert.dom('.section-title').hasText('Build Jobs');
    assert.dom('.jobs-list li').exists({ count: 2 }, 'there should be 2 job items');
    assert.dom('.jobs-item:nth-of-type(1)').hasClass('passed', 'passed class should be applied to a job');
    assert.dom('.jobs-item:nth-of-type(2)').hasClass('failed', 'failed class should be applied to a job');
  });

  test('it renders "Allowed Failures" version without a `required` property', async function(assert) {
    const jobs = {
      jobs: [
        { id: 1 }
      ]
    };
    this.jobs = jobs;
    await render(hbs`{{jobs-list jobs=jobs.jobs}}`);
    assert.dom('.section-title').hasText(/Allowed Failures/);
    assert.dom('.jobs-list li').exists('there should be 1 job item');
  });

  const [job0, job1, job2, job3, job4, job5, jobNotAllowedFailure] = [{
    allowFailure: true,
    state: 'failed',
    isFinished: true,
    number: '19.19',
    stage: { id: '1' }
  }, {
    allowFailure: true,
    state: 'errored',
    isFinished: true,
    number: '19.20',
    stage: { id: '1' }
  }, {
    allowFailure: true,
    state: 'errored',
    isFinished: true,
    number: '19.21',
    stage: { id: '1' }
  }, {
    allowFailure: true,
    state: 'errored',
    isFinished: true,
    number: '19.22',
    stage: { id: '1' }
  }, {
    allowFailure: true,
    state: 'errored',
    isFinished: true,
    number: '19.23',
    stage: { id: '1' }
  }, {
    allowFailure: true,
    state: 'errored',
    isFinished: true,
    number: '19.24',
    stage: { id: '1' }
  }, {
    allowFailure: false,
    state: 'errored',
    isFinished: true,
    number: '19.25',
    stage: { id: '1' }
  }];

  const renderContext = async function (context, jobs, stage = 0) {
    context.stages = [EmberObject.create({ id: '1', number: '1' }), EmberObject.create({ id: '2', number: '2' })];
    context.stage = context.stages[stage];
    context.jobs = A(jobs);
    context.build = { jobs: context.jobs };
    await render(hbs`{{jobs-list build=build jobs=jobs stages=stages stage=stage}})`);
  };

  test('it renders allowed failures text for a non-final stage with a failed job', async function (assert) {
    await renderContext(this, [job0]);
    assert.dom('aside').hasText('Your build matrix was set to allow the failure of job 19.19 so we continued this build to the next stage.');
  });

  test('it renders allowed failures text for a non-final stage with two failed jobs', async function (assert) {
    await renderContext(this, [job0, job1]);
    assert.dom('aside').hasText('Your build matrix was set to allow the failure of jobs 19.19 and 19.20 so we continued this build to the next stage.');
  });

  test('it renders allowed failures text for a non-final stage with three failed jobs', async function (assert) {
    await renderContext(this, [job0, job1, job2]);
    assert.dom('aside').hasText('Your build matrix was set to allow the failure of jobs 19.19, 19.20, and 19.21 so we continued this build to the next stage.');
  });

  test('it renders allowed failures text for a non-final stage with six failed jobs', async function (assert) {
    await renderContext(this, [job0, job1, job2, job3, job4, job5]);
    assert.dom('aside').hasText('Your build matrix was set to allow the failure of multiple jobs so we continued this build to the next stage.');
  });

  test('it renders allowed failures with nothing about continuation for the final stage', async function (assert) {
    await renderContext(this, [{
      allowFailure: true,
      state: 'errored',
      isFinished: true,
      number: '19.99',
      stage: { id: '2' }
    }], 1);
    assert.dom('aside').hasText('Your build matrix was set to allow the failure of job 19.99.');
  });

  test('it renders allowed failures but nothing about continuation when having a not-allowed failure', async function (assert) {
    await renderContext(this, [job0, jobNotAllowedFailure]);
    assert.dom('aside').hasText('Your build matrix was set to allow the failure of job 19.19.');
  });
});
