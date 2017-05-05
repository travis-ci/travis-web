import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('jobs-list', 'Integration | Component | jobs list', {
  integration: true
});

test('it renders a list of jobs', function (assert) {
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
  this.render(hbs`{{jobs-list jobs=jobs.jobs required=jobs.required}}`);

  assert.equal(this.$().find('.section-title').text().trim(), 'Build Jobs');
  assert.equal(this.$().find('.jobs-list li').length, 2, 'there should be 2 job items');
  assert.ok(this.$().find('.jobs-item:nth(0)').hasClass('passed'), 'passed class should be applied to a job');
  assert.ok(this.$().find('.jobs-item:nth(1)').hasClass('failed'), 'failed class should be applied to a job');
});

test('it renders "Allowed Failures" version without a `required` property', function (assert) {
  const jobs = {
    jobs: [
      { id: 1 }
    ]
  };
  this.jobs = jobs;
  this.render(hbs`{{jobs-list jobs=jobs.jobs}}`);
  assert.ok(this.$().find('.section-title').text().match(/Allowed Failures/));
  assert.equal(this.$().find('.jobs-list li').length, 1, 'there should be 1 job item');
});

const [job0, job1, job2, job3, job4, job5] = [{
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
}];

const render = function (context, jobs) {
  context.stages = [Ember.Object.create({ id: '1', number: '1' }), Ember.Object.create({ id: '2', number: '2' })];
  context.stage = context.stages[0];
  context.jobs = Ember.A(jobs);
  context.build = { jobs: context.jobs };
  context.render(hbs`{{jobs-list build=build jobs=jobs stages=stages stage=stage}})`);
};

test('it renders allowed failures text for a non-final stage with a failed job', function (assert) {
  render(this, [job0]);
  assert.equal(this.$().find('aside').text().trim(), 'Your build matrix was set to allow the failure of job 19.19 so we continued this build to the next stage.');
});

test('it renders allowed failures text for a non-final stage with two failed jobs', function (assert) {
  render(this, [job0, job1]);
  assert.equal(this.$().find('aside').text().trim(), 'Your build matrix was set to allow the failure of jobs 19.19 and 19.20 so we continued this build to the next stage.');
});

test('it renders allowed failures text for a non-final stage with three failed jobs', function (assert) {
  render(this, [job0, job1, job2]);
  assert.equal(this.$().find('aside').text().trim(), 'Your build matrix was set to allow the failure of jobs 19.19, 19.20, and 19.21 so we continued this build to the next stage.');
});

test('it renders allowed failures text for a non-final stage with six failed jobs', function (assert) {
  render(this, [job0, job1, job2, job3, job4, job5]);
  assert.equal(this.$().find('aside').text().trim(), 'Your build matrix was set to allow the failure of multiple jobs so we continued this build to the next stage.');
});
