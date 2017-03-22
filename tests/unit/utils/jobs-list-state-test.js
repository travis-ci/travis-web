import jobsListState from 'travis/utils/jobs-list-state';
import { module, test } from 'qunit';

module('Unit | Utility | jobs list state');

test('it reduces a list of jobs to one state', function (assert) {
  const notStarted = { notStarted: true, isFinished: false };
  const running = { state: 'running', isFinished: false };

  const notFinishedJobs = [notStarted, running];

  const failed = { state: 'failed', isFinished: true };
  const errored = { state: 'errored', isFinished: true };
  const canceled = { state: 'canceled', isFinished: true };
  const passed = { state: 'passed', isFinished: true };

  const finishedJobs = [failed, errored, canceled, passed];
  const finishedAndNotPassedJobs = [failed, errored, canceled];

  assert.equal(jobsListState([running, notStarted]), 'running', 'a running job takes precedence over a not-started one');
  // FIXME why is this failing?
  assert.equal(jobsListState([running, passed]), 'running', 'a running job takes precedence over a passed one');
  assert.equal(jobsListState([notStarted, passed]), 'not-started', 'a not-started job takes precedence over a passing one');

  finishedJobs.forEach(job => assert.equal(jobsListState([job, failed]), 'failed', 'expected the whole list to have failed because one job failed'));

  finishedAndNotPassedJobs.forEach(finishedAndNotPassedJob => {
    notFinishedJobs.forEach(notFinishedJob => assert.equal(jobsListState([finishedAndNotPassedJob, notFinishedJob]), finishedAndNotPassedJob.state, `expected a ${finishedAndNotPassedJob.state} job to take priority over a not-finished job state`));
  });

  [canceled, passed].forEach(job => assert.equal(jobsListState([job, errored]), 'errored', `expected an errored job to take priority over a ${job.state} job`));

  assert.equal(jobsListState([canceled, passed]), 'canceled', 'expected a canceled job to take priority over a passed job');

  assert.equal(jobsListState([passed, passed]), 'passed', 'expected a list to have passed only if all its jobs have passed');
});
