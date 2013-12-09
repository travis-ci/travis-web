minispade.require 'ext/jquery'

responseTime = 10

repos = [
  { id: '1', owner: 'travis-ci', name: 'travis-core',   slug: 'travis-ci/travis-core',   build_ids: [1, 2], last_build_id: 1, last_build_number: 1, last_build_state: 'passed', last_build_duration: 30, last_build_started_at: '2012-07-02T00:00:00Z', last_build_finished_at: '2012-07-02T00:00:30Z', description: 'Description of travis-core', github_language: 'ruby' },
  { id: '2', owner: 'travis-ci', name: 'travis-assets', slug: 'travis-ci/travis-assets', build_ids: [3],    last_build_id: 3, last_build_number: 3, last_build_state: 'failed', last_build_duration: 30, last_build_started_at: '2012-07-02T00:01:00Z', last_build_finished_at: '2012-07-01T00:01:30Z', description: 'Description of travis-assets', github_language: 'ruby'},
  { id: '3', owner: 'travis-ci', name: 'travis-hub',    slug: 'travis-ci/travis-hub',    build_ids: [4],    last_build_id: 4, last_build_number: 4, last_build_state: null, last_build_duration: null, last_build_started_at: '2012-07-02T00:02:00Z', last_build_finished_at: null, description: 'Description of travis-hub', github_language: 'ruby' },
]

reposByName = (name) ->
  # this is hardcoded as well as user is hardcoded in app() helper,
  # please make it more flexible if needed
  if name == 'tyrion'
    [repos[0], repos[2]]
  else
    []

builds = [
  { id: '1', repository_id: '1', commit_id: 1, job_ids: [1, 2, 3], number: 1, pull_request: false, config: { rvm: ['rbx', '1.9.3', 'jruby'] }, duration: 30, started_at: '2012-07-02T00:00:00Z', finished_at: '2012-07-02T00:00:30Z', state: 'passed' },
  { id: '2', repository_id: '1', commit_id: 2, job_ids: [4],       number: 2, pull_request: false, config: { rvm: ['rbx'] }, duration: null, state: 'created', finished_at: null },
  { id: '3', repository_id: '2', commit_id: 3, job_ids: [5],       number: 3, pull_request: false, config: { rvm: ['rbx'] }, duration: 30, started_at: '2012-07-02T00:01:00Z', finished_at: '2012-07-01T00:01:30Z', state: 'failed' },
  { id: '4', repository_id: '3', commit_id: 4, job_ids: [6],       number: 4, pull_request: false, config: { rvm: ['rbx'] }, duration: null, started_at: '2012-07-02T00:02:00Z', state: 'queued', finished_at: null },
]

commits = [
  { id: '1', sha: '1234567', branch: 'master',  message: 'commit message 1', author_name: 'author name', author_email: 'author@email.com', committer_name: 'committer name', committer_email: 'committer@email.com', compare_url: 'http://github.com/compare/0123456..1234567' },
  { id: '2', sha: '2345678', branch: 'feature', message: 'commit message 2', author_name: 'author name', author_email: 'author@email.com', committer_name: 'committer name', committer_email: 'committer@email.com', compare_url: 'http://github.com/compare/0123456..2345678' },
  { id: '3', sha: '3456789', branch: 'master',  message: 'commit message 3', author_name: 'author name', author_email: 'author@email.com', committer_name: 'committer name', committer_email: 'committer@email.com', compare_url: 'http://github.com/compare/0123456..3456789' },
  { id: '4', sha: '4567890', branch: 'master',  message: 'commit message 4', author_name: 'author name', author_email: 'author@email.com', committer_name: 'committer name', committer_email: 'committer@email.com', compare_url: 'http://github.com/compare/0123456..4567890' },
]

jobs = [
  { id: '1', repository_id: 1, repository_slug: 'travis-ci/travis-core',   build_id: 1, commit_id: 1, log_id: 1, number: '1.1', config: { rvm: 'rbx' },   duration: 30, started_at: '2012-07-02T00:00:00Z', finished_at: '2012-07-02T00:00:30Z', state: 'passed', allow_failure: false }
  { id: '2', repository_id: 1, repository_slug: 'travis-ci/travis-core',   build_id: 1, commit_id: 1, log_id: 2, number: '1.2', config: { rvm: '1.9.3' }, duration: 40, started_at: '2012-07-02T00:00:00Z', finished_at: '2012-07-02T00:00:40Z', state: 'failed', allow_failure: false }
  { id: '3', repository_id: 1, repository_slug: 'travis-ci/travis-core',   build_id: 1, commit_id: 1, log_id: 3, number: '1.3', config: { rvm: 'jruby' }, duration: null, started_at: null, finished_at: null, allow_failure: true, state: null }
  { id: '4', repository_id: 1, repository_slug: 'travis-ci/travis-core',   build_id: 2, commit_id: 2, log_id: 4, number: '2.1', config: { rvm: 'rbx' }, duration: null, started_at: null, finished_at: null, allow_failure: false, state: null }
  { id: '5', repository_id: 2, repository_slug: 'travis-ci/travis-assets', build_id: 3, commit_id: 3, log_id: 5, number: '3.1', config: { rvm: 'rbx' }, duration: 30, started_at: '2012-07-02T00:01:00Z', finished_at: '2012-07-02T00:01:30Z', state: 'failed', allow_failure: false }
  { id: '6', repository_id: 3, repository_slug: 'travis-ci/travis-hub',    build_id: 4, commit_id: 4, log_id: 6, number: '4.1', config: { rvm: 'rbx' }, started_at: '2012-07-02T00:02:00Z', allow_failure: false, state: null }
  { id: '7', repository_id: 1, repository_slug: 'travis-ci/travis-core',   build_id: 5, commit_id: 5, log_id: 7, number: '5.1', config: { rvm: 'rbx' }, duration: null, started_at: null, finished_at: null, state: 'created', queue: 'builds.linux', allow_failure: false }
  { id: '8', repository_id: 1, repository_slug: 'travis-ci/travis-core',   build_id: 5, commit_id: 5, log_id: 8, number: '5.2', config: { rvm: 'rbx' }, duration: null, started_at: null, finished_at: null, state: 'created', queue: 'builds.linux', allow_failure: false }
]

artifacts = [
  { id: '1', body: 'log 1' }
  { id: '2', body: 'log 2' }
  { id: '3', body: 'log 3' }
  { id: '4', body: 'log 4' }
  { id: '5', body: 'log 5' }
  { id: '6', body: 'log 6' }
  { id: '7', body: 'log 7' }
  { id: '8', body: 'log 8' }
]

branches = [
  { branches: [builds[0], builds[1]], commits: [commits[0], commits[1]] },
  { branches: [builds[2]], commits: [commits[2]] },
  { branches: [builds[3]], commits: [commits[3]] },
]

workers = [
  { id: '1', name: 'ruby-1', host: 'worker.travis-ci.org', state: 'ready' }
  { id: '2', name: 'ruby-2', host: 'worker.travis-ci.org', state: 'ready' }
]

hooks = [
  { slug: 'travis-ci/travis-core', description: 'description of travis-core', active: true, private: false }
  { slug: 'travis-ci/travis-assets', description: 'description of travis-assets', active: false, private: false }
  { slug: 'svenfuchs/minimal', description: 'description of minimal', active: true, private: false }
]


$.mockjax
  url: '/repos'
  responseTime: responseTime
  response: (settings) ->
    if !settings.data
      this.responseText = { repos: repos }
    else if slug = settings.data.slug
      this.responseText = { repos: [$.detect(repos, (repository) -> repository.slug == slug)] }
    else if search = settings.data.search
      this.responseText = { repos: $.select(repos, (repository) -> repository.slug.indexOf(search) > -1).toArray() }
    else if settings.data.member
      this.responseText = { repos: reposByName(settings.data.member) }
    else
      console.log settings.data
      throw 'unknown params for repos'

for repository in repos
  $.mockjax
    url: '/' + repository.slug
    responseTime: responseTime
    responseText: { repository: repository }

  $.mockjax
    url: '/repos'
    data: { slug: repository.slug }
    responseTime: responseTime
    responseText: { repos: [repository] }

  $.mockjax
    url: '/builds'
    data: { ids: repository.build_ids }
    responseTime: responseTime
    responseText: { builds: $.select(builds, (build) -> repository.build_ids.indexOf(build.id) != -1) }

  $.mockjax
    url: '/builds'
    data: { repository_id: repository.id, event_type: 'push' }
    responseTime: responseTime
    responseText:
      builds: (builds[id - 1] for id in repository.build_ids)
      commits: (commits[builds[id - 1].commit_id - 1] for id in repository.build_ids)

for build in builds
  $.mockjax
    url: '/builds/' + build.id
    responseTime: responseTime
    responseText:
      build: build,
      commit: commits[build.commit_id - 1]
      jobs: (jobs[id - 1] for id in build.job_ids)

  # $.mockjax
  #   url: '/jobs'
  #   data: { ids: build.job_ids.join(',') }
  #   responseTime: responseTime
  #   responseText: { jobs: $.select(jobs, (job) -> build.job_ids.indexOf(job.id) != -1) }

for job in jobs
  $.mockjax
    url: '/jobs/' + job.id
    responseTime: responseTime
    responseText:
      job: job,
      commit: commits[job.commit_id - 1]

$.mockjax
  url: '/jobs'
  responseTime: responseTime
  responseText:
    jobs: $.select(jobs, (job) -> job.state == 'created')

$.mockjax
  url: '/builds*'
  responseTime: responseTime
  response: (settings) ->
    if match = settings.url.match('/builds\\?(ids.*)')
      ids = match[1].split(new RegExp('&?ids\\[\\]=')).filter (str) -> str != ''
      this.responseText = { builds: $.select(builds, (build) -> ids.contains(build.id) ) }
    else
      throw "can't handle mocked request"

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
  url: '/profile/hooks'
  responseTime: responseTime
  responseText: { hooks: hooks }
