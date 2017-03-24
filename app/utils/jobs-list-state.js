import get from 'ember-metal/get';

export default function jobsListState(jobs) {
  // If all jobs passed, the list passed
  if (jobs.every(job => get(job, 'state') == 'passed')) {
    return 'passed';
  // If any job is running and the rest are unfinished or passed, the list is running
  } else if (jobs.every(job => !get(job, 'isFinished') || get(job, 'state') == 'passing') && jobs.any(job => get(job, 'state') == 'running')) {
    return 'running';
  // If any job is not-started and the rest are unfinished or passed, the list is not-started
  } else if (jobs.any(job => get(job, 'notStarted')) && jobs.every(job => get(job, 'state') == 'passed' || get(job, 'notStarted'))) {
    return 'not-started';
  } else if (jobs.any(job => get(job, 'state') == 'failed')) {
    return 'failed';
  } else if (jobs.any(job => get(job, 'state') == 'errored')) {
    return 'errored';
  } else if (jobs.any(job => get(job, 'state') == 'canceled')) {
    return 'canceled';
  }
}
