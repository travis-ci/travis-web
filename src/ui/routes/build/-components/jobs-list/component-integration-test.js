import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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
