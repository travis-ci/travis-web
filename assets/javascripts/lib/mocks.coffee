require 'ext/jquery'

responseTime = 0

repositories = [
  { id: 1, owner: 'travis-ci', name: 'travis-core',   slug: 'travis-ci/travis-core',   build_ids: [1, 2], last_build_id: 1, last_build_number: 1, last_build_result: 0, last_build_duration: 30, last_build_started_at: '2012-07-02T00:00:00Z', last_build_finished_at: '2012-07-02T00:00:30Z', description: 'Description of travis-core' },
  { id: 2, owner: 'travis-ci', name: 'travis-assets', slug: 'travis-ci/travis-assets', build_ids: [3],    last_build_id: 3, last_build_number: 3, last_build_result: 1, last_build_duration: 30, last_build_started_at: '2012-07-02T00:01:00Z', last_build_finished_at: '2012-07-01T00:01:30Z', description: 'Description of travis-assets'},
  { id: 3, owner: 'travis-ci', name: 'travis-hub',    slug: 'travis-ci/travis-hub',    build_ids: [4],    last_build_id: 4, last_build_number: 4, last_build_result: undefined, last_build_duration: undefined, last_build_started_at: '2012-07-02T00:02:00Z', last_build_finished_at: undefined, description: 'Description of travis-hub'},
]

builds = [
  { id: 1, repository_id: '1', commit_id: 1, job_ids: [1, 2, 3], number: 1, event_type: 'push', config: { rvm: ['rbx', '1.9.3', 'jruby'] }, duration: 30, started_at: '2012-07-02T00:00:00Z', finished_at: '2012-07-02T00:00:30Z', result: 0 },
  { id: 2, repository_id: '1', commit_id: 2, job_ids: [4],       number: 2, event_type: 'push', config: { rvm: ['rbx'] } },
  { id: 3, repository_id: '2', commit_id: 3, job_ids: [5],       number: 3, event_type: 'push', config: { rvm: ['rbx'] }, duration: 30, started_at: '2012-07-02T00:01:00Z', finished_at: '2012-07-01T00:01:30Z', result: 1 },
  { id: 4, repository_id: '3', commit_id: 4, job_ids: [6],       number: 4, event_type: 'push', config: { rvm: ['rbx'] }, started_at: '2012-07-02T00:02:00Z' },
]

commits = [
  { id: 1, sha: '1234567', branch: 'master',  message: 'commit message 1', author_name: 'author name', author_email: 'author@email.com', committer_name: 'committer name', committer_email: 'committer@email.com', compare_url: 'http://github.com/compare/0123456..1234567' },
  { id: 2, sha: '2345678', branch: 'feature', message: 'commit message 2', author_name: 'author name', author_email: 'author@email.com', committer_name: 'committer name', committer_email: 'committer@email.com', compare_url: 'http://github.com/compare/0123456..2345678' },
  { id: 3, sha: '3456789', branch: 'master',  message: 'commit message 3', author_name: 'author name', author_email: 'author@email.com', committer_name: 'committer name', committer_email: 'committer@email.com', compare_url: 'http://github.com/compare/0123456..3456789' },
  { id: 4, sha: '4567890', branch: 'master',  message: 'commit message 4', author_name: 'author name', author_email: 'author@email.com', committer_name: 'committer name', committer_email: 'committer@email.com', compare_url: 'http://github.com/compare/0123456..4567890' },
]

jobs = [
  { id: 1, repository_id: 1, build_id: 1, commit_id: 1, log_id: 1, number: '1.1', config: { rvm: 'rbx' },   duration: 30, started_at: '2012-07-02T00:00:00Z', finished_at: '2012-07-02T00:00:30Z', result: 0 }
  { id: 2, repository_id: 1, build_id: 1, commit_id: 1, log_id: 2, number: '1.2', config: { rvm: '1.9.3' }, duration: 40, started_at: '2012-07-02T00:00:00Z', finished_at: '2012-07-02T00:00:40Z', result: 1 }
  { id: 3, repository_id: 1, build_id: 1, commit_id: 1, log_id: 3, number: '1.3', config: { rvm: 'jruby' }, allow_failure: true }
  { id: 4, repository_id: 1, build_id: 2, commit_id: 2, log_id: 4, number: '2.1', config: { rvm: 'rbx' } }
  { id: 5, repository_id: 2, build_id: 3, commit_id: 3, log_id: 5, number: '3.1', config: { rvm: 'rbx' }, duration: 30, started_at: '2012-07-02T00:01:00Z', finished_at: '2012-07-02T00:01:30Z', result: 1 }
  { id: 6, repository_id: 3, build_id: 4, commit_id: 4, log_id: 6, number: '4.1', config: { rvm: 'rbx' }, started_at: '2012-07-02T00:02:00Z' }
  { id: 7, repository_id: 1, build_id: 5, commit_id: 5, log_id: 7, number: '5.1', config: { rvm: 'rbx' }, state: 'created', queue: 'builds.common' }
  { id: 8, repository_id: 1, build_id: 5, commit_id: 5, log_id: 8, number: '5.2', config: { rvm: 'rbx' }, state: 'created', queue: 'builds.common' }
]

artifacts = [
  { id: 1, body: 'log 1' }
  { id: 2, body: 'log 2' }
  { id: 3, body: 'log 3' }
  { id: 4, body: 'log 4' }
  { id: 5, body: 'log 5' }
  { id: 6, body: 'log 6' }
  { id: 7, body: 'log 7' }
  { id: 8, body: 'log 8' }
]

branches = [
  { branches: [builds[0], builds[1]], commits: [commits[0], commits[1]] },
  { branches: [builds[2]], commits: [commits[2]] },
  { branches: [builds[3]], commits: [commits[3]] },
]

workers = [
  { id: 1, name: 'ruby-1', host: 'worker.travis-ci.org', state: 'ready' }
  { id: 2, name: 'ruby-2', host: 'worker.travis-ci.org', state: 'ready' }
]

hooks = [
  { slug: 'travis-ci/travis-core', description: 'description of travis-core', active: true, private: false }
  { slug: 'travis-ci/travis-assets', description: 'description of travis-assets', active: false, private: false }
  { slug: 'svenfuchs/minimal', description: 'description of minimal', active: true, private: false }
]


$.mockjax
  url: '/repositories'
  responseTime: responseTime
  response: (settings) ->
    if !settings.data
      this.responseText = { repositories: repositories }
    else if slug = settings.data.slug
      this.responseText = { repositories: [$.detect(repositories, (repository) -> repository.slug == slug)] }
    else if search = settings.data.search
      this.responseText = { repositories: $.select(repositories, (repository) -> repository.slug.indexOf(search) > -1).toArray() }
    else
      raise "don't know this ditty"

for repository in repositories
  $.mockjax
    url: '/' + repository.slug
    responseTime: responseTime
    responseText: { repository: repository }

  $.mockjax
    url: '/repositories'
    data: { slug: repository.slug }
    responseTime: responseTime
    responseText: { repositories: [repository] }

  $.mockjax
    url: '/builds'
    data: { ids: repository.build_ids }
    responseTime: responseTime
    responseText: { builds: $.select(builds, (build) -> repository.build_ids.indexOf(build.id) != -1) }

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

for data in branches
  $.mockjax
    url: '/branches'
    data: { repository_id: data.branches[0].repository_id }
    responseTime: responseTime
    responseText: data

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

$.mockjax
  url: '/profile/hooks'
  responseTime: responseTime
  responseText: { hooks: hooks }

