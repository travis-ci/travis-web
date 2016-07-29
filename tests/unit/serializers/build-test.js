import { moduleForModel, test } from 'ember-qunit';

moduleForModel('build', 'Unit | Serializer | build', {
  // Specify the other units that are required for this test.
  needs: ['serializer:build', 'model:commit', 'model:job', 'model:branch']
});

test('it normalizes the singular response', function () {
  QUnit.dump.maxDepth = 10;
  let payload = {
    build: {
      id: 1,
      repository_id: 2,
      commit_id: 3,
      number: '10',
      event_type: 'push',
      pull_request: false,
      pull_request_title: null,
      pull_request_number: null,
      config: { 'language': 'ruby' },
      state: 'passed',
      started_at: '2016-02-24T16:37:54Z',
      finished_at: '2016-02-24T16:40:10Z',
      duration: 72,
      job_ids: [5, 6]
    },
    commit: {
      id: 3,
      sha: '864c69a9588024331ba0190e9d8492ae0b6d5eff',
      branch: 'development',
      branch_is_default: false,
      message: 'A commit',
      committed_at: '2016-02-24T16:36:23Z',
      author_name: 'Mr. Travis',
      author_email: 'nothing@travis-ci.org',
      committer_name: 'Mr. Travis',
      committer_email: 'nothing@travis-ci.org',
      compare_url: 'https://github.com/drogus/test-project-1/compare/432d5426aa67...864c69a95880'
    },
    jobs: [{
      id: 5,
      repository_id: 2,
      build_id: 1,
      commit_id: 3,
      log_id: 7,
      state: 'passed',
      number: '10.1',
      config: { 'language': 'ruby' },
      started_at: '2016-02-24T16:37:54Z',
      finished_at: '2016-02-24T16:38:19Z',
      queue: 'builds.docker',
      allow_failure: false,
      tags: null
    }, {
      id: 6,
      repository_id: 2,
      build_id: 1,
      commit_id: 3,
      log_id: 8,
      state: 'passed',
      number: '10.2',
      config: { 'language': 'ruby' },
      started_at: '2016-02-24T16:37:54Z',
      finished_at: '2016-02-24T16:38:19Z',
      queue: 'builds.docker',
      allow_failure: false,
      tags: null
    }]
  };


  let store = this.store();
  let serializer = store.serializerFor('build');
  let result = serializer.normalizeResponse(store, store.modelFor('build'), payload, 1, 'findRecord');

  let expectedResult = {
    'data': {
      'id': '1',
      'type': 'build',
      'attributes': {
        'state': 'passed',
        'number': 10,
        '_duration': 72,
        '_config': { 'language': 'ruby' },
        '_startedAt': '2016-02-24T16:37:54Z',
        '_finishedAt': '2016-02-24T16:40:10Z',
        'pullRequest': false,
        'pullRequestTitle': null,
        'pullRequestNumber': null,
        'eventType': 'push'
      },
      'relationships': {
        'branch': {
          'data': {
            'name': 'development',
            'default_branch': false,
            '@href': '\/repo\/2\/branch\/development',
            'id': '\/repo\/2\/branch\/development',
            'type': 'branch'
          }
        },
        'repo': {
          'data': {
            'id': '2',
            'type': 'repo'
          }
        },
        'commit': {
          'data': {
            'id': '3',
            'sha': '864c69a9588024331ba0190e9d8492ae0b6d5eff',
            'branch': 'development',
            'branch_is_default': false,
            'message': 'A commit',
            'committed_at': '2016-02-24T16:36:23Z',
            'author_name': 'Mr. Travis',
            'author_email': 'nothing@travis-ci.org',
            'committer_name': 'Mr. Travis',
            'committer_email': 'nothing@travis-ci.org',
            'compare_url': 'https:\/\/github.com\/drogus\/test-project-1\/compare\/432d5426aa67...864c69a95880',
            'type': 'commit'
          }
        },
        'jobs': {
          'data': [
            {
              'id': '5',
              'repository_id': 2,
              'build_id': 1,
              'commit_id': 3,
              'log_id': 7,
              'state': 'passed',
              'number': '10.1',
              'config': { 'language': 'ruby' },
              'started_at': '2016-02-24T16:37:54Z',
              'finished_at': '2016-02-24T16:38:19Z',
              'queue': 'builds.docker',
              'allow_failure': false,
              'tags': null,
              'type': 'job'
            },
            {
              'id': '6',
              'repository_id': 2,
              'build_id': 1,
              'commit_id': 3,
              'log_id': 8,
              'state': 'passed',
              'number': '10.2',
              'config': { 'language': 'ruby' },
              'started_at': '2016-02-24T16:37:54Z',
              'finished_at': '2016-02-24T16:38:19Z',
              'queue': 'builds.docker',
              'allow_failure': false,
              'tags': null,
              'type': 'job'
            }
          ]
        }
      }
    },
    'included': [
      {
        'id': '\/repo\/2\/branch\/development',
        'type': 'branch',
        'attributes': {},
        'relationships': {}
      },
      {
        'id': '3',
        'type': 'commit',
        'attributes': {},
        'relationships': {}
      },
      {
        'id': '5',
        'type': 'job',
        'attributes': {},
        'relationships': {}
      },
      {
        'id': '6',
        'type': 'job',
        'attributes': {},
        'relationships': {}
      }
    ]
  };
  deepEqual(expectedResult, result);
});

test('it normalizes the plural v3 response', function () {
  QUnit.dump.maxDepth = 10;

  let payload = {
    '@type': 'builds',
    '@href': '/repo/1398458/builds',
    '@representation': 'standard',
    '@pagination': {
      'limit': 25,
      'offset': 0,
      'count': 19371,
      'is_first': true,
      'is_last': false,
      'next': {
        '@href': '/repo/1398458/builds?limit=25&offset=25',
        'offset': 25,
        'limit': 25
      },
      'prev': null,
      'first': {
        '@href': '/repo/1398458/builds',
        'offset': 0,
        'limit': 25
      },
      'last': {
        '@href': '/repo/1398458/builds?limit=25&offset=19350',
        'offset': 19350,
        'limit': 25
      }
    },
    'builds': [
      {
        '@type': 'build',
        '@href': '/build/148292327',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 148292327,
        'number': '15264',
        'state': 'failed',
        'duration': 686,
        'event_type': 'push',
        'previous_state': 'failed',
        'started_at': '2016-07-29T12:13:18Z',
        'finished_at': '2016-07-29T12:18:15Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'minimal',
          'id': 42097345,
          'sha': '48f6dd71bdcce16bfac61bbad8ecdb31e5233fd7',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head-clang (c463366)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/e720a5dd5e71...48f6dd71bdcc',
          'committed_at': '2016-07-29T12:06:04Z'
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/148292328',
            '@representation': 'minimal',
            'id': 148292328
          },
          {
            '@type': 'job',
            '@href': '/job/148292329',
            '@representation': 'minimal',
            'id': 148292329
          },
          {
            '@type': 'job',
            '@href': '/job/148292330',
            '@representation': 'minimal',
            'id': 148292330
          },
          {
            '@type': 'job',
            '@href': '/job/148292331',
            '@representation': 'minimal',
            'id': 148292331
          },
          {
            '@type': 'job',
            '@href': '/job/148292332',
            '@representation': 'minimal',
            'id': 148292332
          }
        ]
      },
      {
        '@type': 'build',
        '@href': '/build/148292316',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'cancel': true,
          'restart': true
        },
        'id': 148292316,
        'number': '15263',
        'state': 'failed',
        'duration': 828,
        'event_type': 'push',
        'previous_state': 'failed',
        'started_at': '2016-07-29T12:06:57Z',
        'finished_at': '2016-07-29T12:12:35Z',
        'repository': {
          '@type': 'repository',
          '@href': '/repo/1398458',
          '@representation': 'minimal',
          'id': 1398458,
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'branch': {
          '@type': 'branch',
          '@href': '/repo/1398458/branch/build',
          '@representation': 'minimal',
          'name': 'build'
        },
        'commit': {
          '@type': 'commit',
          '@representation': 'minimal',
          'id': 42097342,
          'sha': 'e720a5dd5e71d9f6640a6fa256ca534113ae4092',
          'ref': 'refs/heads/build',
          'message': 'trigger new build for ruby-head (c463366)',
          'compare_url': 'https://github.com/travis-ci/travis-rubies/compare/5fc77b27c59a...e720a5dd5e71',
          'committed_at': '2016-07-29T12:06:02Z'
        },
        'jobs': [
          {
            '@type': 'job',
            '@href': '/job/148292317',
            '@representation': 'minimal',
            'id': 148292317
          },
          {
            '@type': 'job',
            '@href': '/job/148292318',
            '@representation': 'minimal',
            'id': 148292318
          },
          {
            '@type': 'job',
            '@href': '/job/148292319',
            '@representation': 'minimal',
            'id': 148292319
          },
          {
            '@type': 'job',
            '@href': '/job/148292320',
            '@representation': 'minimal',
            'id': 148292320
          },
          {
            '@type': 'job',
            '@href': '/job/148292321',
            '@representation': 'minimal',
            'id': 148292321
          }
        ]
      }
    ]
  };

  let store = this.store();
  let serializer = store.serializerFor('build');
  let result = serializer.normalizeResponse(store, store.modelFor('build'), payload, null, 'query');

  let expectedResult = {
    'data': [
      {
        'attributes': {
          'duration': 686,
          'event-type': 'push',
          'finished-at': '2016-07-29T12:18:15Z',
          'number': '15264',
          'started-at': '2016-07-29T12:13:18Z',
          'state': 'failed'
        },
        'id': 148292327,
        'relationships': {
          'branch': {
            'data': {
              'id': '/repo/1398458/branch/build',
              'type': 'branch'
            }
          },
          'commit': {
            'data': {
              'id': 42097345,
              'type': 'commit'
            }
          },
          'repo': {
            'data': {
              'id': 1398458,
              'type': 'repo'
            }
          }
        },
        'type': 'build'
      },
      {
        'attributes': {
          'duration': 828,
          'event-type': 'push',
          'finished-at': '2016-07-29T12:12:35Z',
          'number': '15263',
          'started-at': '2016-07-29T12:06:57Z',
          'state': 'failed'
        },
        'id': 148292316,
        'relationships': {
          'branch': {
            'data': {
              'id': '/repo/1398458/branch/build',
              'type': 'branch'
            }
          },
          'commit': {
            'data': {
              'id': 42097342,
              'type': 'commit'
            }
          },
          'repo': {
            'data': {
              'id': 1398458,
              'type': 'repo'
            }
          }
        },
        'type': 'build'
      }
    ],
    'included': [
      {
        'attributes': {
          'committed-at': '2016-07-29T12:06:04Z',
          'compare-url': 'https://github.com/travis-ci/travis-rubies/compare/e720a5dd5e71...48f6dd71bdcc',
          'message': 'trigger new build for ruby-head-clang (c463366)',
          'sha': '48f6dd71bdcce16bfac61bbad8ecdb31e5233fd7'
        },
        'id': 42097345,
        'type': 'commit'
      },
      {
        'attributes': {
          'name': 'build'
        },
        'id': '/repo/1398458/branch/build',
        'type': 'branch'
      },
      {
        'attributes': {
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'id': 1398458,
        'type': 'repo'
      },
      {
        'attributes': {
          'committed-at': '2016-07-29T12:06:02Z',
          'compare-url': 'https://github.com/travis-ci/travis-rubies/compare/5fc77b27c59a...e720a5dd5e71',
          'message': 'trigger new build for ruby-head (c463366)',
          'sha': 'e720a5dd5e71d9f6640a6fa256ca534113ae4092'
        },
        'id': 42097342,
        'type': 'commit'
      },
      {
        'attributes': {
          'name': 'build'
        },
        'id': '/repo/1398458/branch/build',
        'type': 'branch'
      },
      {
        'attributes': {
          'name': 'travis-rubies',
          'slug': 'travis-ci/travis-rubies'
        },
        'id': 1398458,
        'type': 'repo'
      }
    ]
  };

  deepEqual(result, expectedResult);
});
