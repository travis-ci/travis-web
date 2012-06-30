require 'ext/jquery'

responseTime = 0

repositories = [
  { id: 1, owner: 'travis-ci', name: 'travis-core',   slug: 'travis-ci/travis-core',   build_ids: [1, 2], last_build_id: 1, last_build_number: 1, last_build_result: 0 },
  { id: 2, owner: 'travis-ci', name: 'travis-assets', slug: 'travis-ci/travis-assets', build_ids: [3],    last_build_id: 3, last_build_number: 3},
  { id: 3, owner: 'travis-ci', name: 'travis-hub',    slug: 'travis-ci/travis-hub',    build_ids: [4],    last_build_id: 4, last_build_number: 4},
]

builds = [
  { id: 1, repository_id: '1', commit_id: 1, job_ids: [1, 2], number: 1, event_type: 'push', config: { rvm: ['rbx', '1.9.3'] }, finished_at: '2012-06-20T00:21:20Z', duration: 35, result: 0 },
  { id: 2, repository_id: '1', commit_id: 2, job_ids: [3],    number: 2, event_type: 'push', config: { rvm: ['rbx'] } },
  { id: 3, repository_id: '2', commit_id: 3, job_ids: [4],    number: 3, event_type: 'push', config: { rvm: ['rbx'] }, finished_at: '2012-06-20T00:21:20Z', duration: 35, result: 0 },
  { id: 4, repository_id: '3', commit_id: 4, job_ids: [5],    number: 4, event_type: 'push', config: { rvm: ['rbx'] } },
]

commits = [
  { id: 1, sha: '1234567', branch: 'master',  message: 'commit message 1', author_name: 'author name', author_email: 'author@email.com', compare_url: 'http://github.com/compare/0123456..1234567' },
  { id: 2, sha: '2345678', branch: 'feature', message: 'commit message 2', author_name: 'author name', author_email: 'author@email.com', compare_url: 'http://github.com/compare/0123456..2345678' },
  { id: 3, sha: '3456789', branch: 'master',  message: 'commit message 3', author_name: 'author name', author_email: 'author@email.com', compare_url: 'http://github.com/compare/0123456..3456789' },
  { id: 4, sha: '4567890', branch: 'master',  message: 'commit message 4', author_name: 'author name', author_email: 'author@email.com', compare_url: 'http://github.com/compare/0123456..4567890' },
]

jobs = [
  { id: 1, repository_id: 1, build_id: 1, commit_id: 1, log_id: 1, number: '1.1', config: { rvm: 'rbx' }, finished_at: '2012-06-20T00:21:20Z', duration: 35, result: 0 }
  { id: 2, repository_id: 1, build_id: 1, commit_id: 1, log_id: 2, number: '1.2', config: { rvm: '1.9.3' } }
  { id: 3, repository_id: 1, build_id: 2, commit_id: 2, log_id: 3, number: '2.1', config: { rvm: 'rbx' } }
  { id: 4, repository_id: 2, build_id: 3, commit_id: 3, log_id: 4, number: '3.1', config: { rvm: 'rbx' }, finished_at: '2012-06-20T00:21:20Z', duration: 35, result: 0 }
  { id: 5, repository_id: 3, build_id: 4, commit_id: 4, log_id: 5, number: '4.1', config: { rvm: 'rbx' } }
  { id: 6, repository_id: 1, build_id: 5, commit_id: 5, log_id: 5, number: '5.1', config: { rvm: 'rbx' }, state: 'created', queue: 'builds.common' }
  { id: 7, repository_id: 1, build_id: 5, commit_id: 5, log_id: 5, number: '5.2', config: { rvm: 'rbx' }, state: 'created', queue: 'builds.common' }
]

artifacts = [
  { id: 1, body: 'log 1' }
  { id: 2, body: 'log 2' }
  { id: 3, body: 'log 3' }
  { id: 4, body: 'log 4' }
  { id: 5, body: 'log 4' }
]

workers = [
  { id: 1, name: 'ruby-1', host: 'worker.travis-ci.org', state: 'ready' }
  { id: 2, name: 'ruby-2', host: 'worker.travis-ci.org', state: 'ready' }
]

$.mockjax
  url: '/repositories'
  responseTime: responseTime
  responseText: { repositories: repositories }

for repository in repositories
  $.mockjax
    url: '/' + repository.slug
    responseTime: responseTime
    responseText: { repository: repository }

for build in builds
  $.mockjax
    url: '/builds/' + build.id
    responseTime: responseTime
    responseText:
      build: build,
      commit: commits[build.commit_id - 1]
      jobs: (jobs[id - 1] for id in build.job_ids)

for repository in repositories
  $.mockjax
    url: '/builds'
    data: { repository_id: repository.id, event_type: 'push', orderBy: 'number DESC' }
    responseTime: responseTime
    responseText:
      builds: (builds[id - 1] for id in repository.build_ids)
      commits: (commits[builds[id - 1].commit_id - 1] for id in repository.build_ids)

for job in jobs
  $.mockjax
    url: '/jobs/' + job.id
    responseTime: responseTime
    responseText:
      job: job,
      commit: commits[job.commit_id - 1]

for artifact in artifacts
  $.mockjax
    url: '/artifacts/' + artifact.id
    responseTime: responseTime
    responseText:
      artifact: artifact

$.mockjax
  url: '/workers'
  responseTime: responseTime
  responseText: { workers: workers }

$.mockjax
  url: '/jobs'
  responseTime: responseTime
  responseText:
    jobs: $.select(jobs, (job) -> job.state == 'created')
