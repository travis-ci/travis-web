import { moduleForModel, test } from 'ember-qunit';

moduleForModel('build', 'Unit | Serializer | build', {
  // Specify the other units that are required for this test.
  needs: ['serializer:build', 'serializer:commit', 'serializer:job', 'serializer:repo', 'model:commit', 'model:job', 'model:branch', 'model:repo']
});

test('it normalizes a V3 singular response with nested jobs and repos', function (assert) {
  let payload = {
    '@type': 'build',
    '@href': '/v3/build/1',
    '@representation': 'standard',
    'id': 1,
    'number': '1',
    'state': 'passed',
    'repository': {
      '@type': 'repository',
      '@href': '/v3/repo/1',
      '@representation': 'standard',
      'id': 1,
      'name': 'travis-web',
      'slug': 'travis-ci/travis-web'
    },
    'jobs': [
      {
        '@type': 'job',
        '@href': '/v3/job/1',
        '@representation': 'standard',
        'id': 1,
        'number': '1.1',
        'state': 'passed',
        'repository': {
          '@href': '/v3/repo/1'
        }
      },
      {
        '@type': 'job',
        '@href': '/v3/job/2',
        '@representation': 'standard',
        'id': 2,
        'number': '1.2',
        'state': 'passed',
        'repository': {
          '@href': '/v3/repo/1'
        }
      }
    ]
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
        'number': 1
      },
      'relationships': {
        'repo': {
          'data': {
            'id': '1',
            'type': 'repo'
          }
        },
        'jobs': {
          'data': [
            {
              'id': '1',
              'type': 'job'
            },
            {
              'id': '2',
              'type': 'job'
            }
          ]
        }
      }
    },
    'included': [
      {
        'id': '1',
        'type': 'repo',
        'attributes': {
          'slug': 'travis-ci/travis-web',
          'name': 'travis-web'
        },
        'relationships': {}
      },
      {
        'id': '1',
        'type': 'job',
        'attributes': {
          'state': 'passed',
          'number': '1.1'
        },
        'relationships': {
          'repo': {
            'data': {
              'id': '1',
              'type': 'repo'
            }
          }
        }
      },
      {
        'id': '2',
        'type': 'job',
        'attributes': {
          'state': 'passed',
          'number': '1.2'
        },
        'relationships': {
          'repo': {
            'data': {
              'id': '1',
              'type': 'repo'
            }
          }
        }
      }
    ]
  };

  assert.deepEqual(result, expectedResult);
});
