$.mockjax
  url: '/repositories',
  responseTime: 0,
  responseText:
    repositories: [
      { id: 1, owner: 'travis-ci', name: 'travis-core',   slug: 'travis-ci/travis-core',   build_ids: [1, 2], last_build_id: 1, last_build_number: 1, last_build_result: 0 },
      { id: 2, owner: 'travis-ci', name: 'travis-assets', slug: 'travis-ci/travis-assets', build_ids: [3],    last_build_id: 3, last_build_number: 3},
      { id: 3, owner: 'travis-ci', name: 'travis-hub',    slug: 'travis-ci/travis-hub',    build_ids: [4],    last_build_id: 4, last_build_number: 4},
    ],

$.mockjax
  url: '/travis-ci/travis-core',
  responseTime: 0,
  responseText:
    repository: { id: 1, owner: 'travis-ci', name: 'travis-core',   slug: 'travis-ci/travis-core',   build_ids: [1, 2], last_build_id: 1, last_build_number: 1, last_build_result: 0 }

$.mockjax
  url: '/travis-ci/travis-assets',
  responseTime: 0,
  responseText:
    repository: { id: 1, owner: 'travis-ci', name: 'travis-core',   slug: 'travis-ci/travis-core',   build_ids: [1, 2], last_build_id: 1, last_build_number: 1, last_build_result: 0 }

$.mockjax
  url: '/builds/1',
  resposeTime: 0,
  responseText:
    build: { id: 1, repository_id: 'travis-ci/travis-core',   commit_id: 1, job_ids: [1, 2], number: 1, event_type: 'push', config: { rvm: ['rbx', '1.9.3'] }, finished_at: '2012-06-20T00:21:20Z', duration: 35, result: 0 }

$.mockjax
  url: '/builds/2',
  resposeTime: 0,
  responseText:
    build: { id: 1, repository_id: 'travis-ci/travis-assets',   commit_id: 1, job_ids: [1, 2], number: 1, event_type: 'push', config: { rvm: ['rbx'] }, finished_at: '2012-06-20T00:21:20Z', duration: 35, result: 0 }

@Travis = Em.Application.create()

require 'ext/jquery'
require 'locales'
require 'travis/data_store/rest_adapter'
require 'helpers'
require 'models'
require 'views'
require 'templates'
require 'controllers'
require 'routes'

# Travis = window.Travis
Travis.store = DS.Store.extend(
  revision: 4
  adapter: Travis.RestAdapter.create()
  # adapter: Travis.FixtureAdapter.create()
).create()

Travis.initialize()
