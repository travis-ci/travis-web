import { moduleForModel, test } from 'ember-qunit';

moduleForModel('repo', 'Unit | Serializer | repo', {
  // Specify the other units that are required for this test.
  needs: ['serializer:repo', 'serializer:branch', 'serializer:build',
    'serializer:commit', 'model:commit', 'model:job', 'model:branch',
    'model:repo', 'model:build']
});

test('it includes pagination info in collections', function (assert) {
  let payload =  {
    '@type': 'repositories',
    '@href': '/owner/drogus/repos?limit=1',
    '@representation': 'standard',
    '@pagination': {
      'limit': 1,
      'offset': 0,
      'count': 114,
      'is_first': true,
      'is_last': false,
      'next': {
        '@href': '/owner/drogus/repos?limit=1&offset=1',
        'offset': 1,
        'limit': 1
      },
      'prev': null,
      'first': {
        '@href': '/owner/drogus/repos?limit=1',
        'offset': 0,
        'limit': 1
      },
      'last': {
        '@href': '/owner/drogus/repos?limit=1&offset=113',
        'offset': 113,
        'limit': 1
      }
    },
    'repositories': [
      {
        '@type': 'repository',
        '@href': '/repo/124920',
        '@representation': 'standard',
        '@permissions': {
          'read': true,
          'admin': true,
          'activate': true,
          'deactivate': true,
          'star': true,
          'unstar': true,
          'create_cron': true,
          'create_env_var': true,
          'create_key_pair': true,
          'delete_key_pair': true,
          'create_request': true
        },
        'id': 124920,
        'name': 'test-project-1',
        'slug': 'drogus/test-project-1',
        'description': 'Test dummy repository for testing Travis CI',
        'github_language': null,
        'active': true,
        'private': false,
        'owner': {
          '@type': 'user',
          'id': 515,
          'login': 'drogus',
          '@href': '/user/515'
        },
        'default_branch': {
          '@type': 'branch',
          '@href': '/repo/124920/branch/master',
          '@representation': 'minimal',
          'name': 'master'
        },
        'starred': false
      }
    ]
  };

  let store = this.store();
  let serializer = store.serializerFor('repo');
  let result = serializer.normalizeArrayResponse(store, store.modelFor('repo'), payload, null, 'findQuery');
  let { meta } = result;

  assert.ok(meta.pagination);
  assert.equal(meta.pagination.count, 114, 'count should be equal to 114');
  assert.ok(meta.pagination.limit, 1, 'limit should be equal to 1');
});

test('it includes deep nested relationships in include array', function (assert) {
  let payload = {
    '@type': 'repository',
    '@href': '/repo/1',
    '@representation': 'standard',
    'id': 1,
    'name': 'travis-web',
    'current_build': {
      '@href': '/build/1',
    },
    'default_branch': {
      '@href': '/repo/1/branch/master',
      '@representation': 'standard',
      '@type': 'branch',
      'name': 'master',
      'last_build': {
        '@type': 'build',
        '@representation': 'standard',
        '@href': '/build/1',
        'id': 1,
        'number': '1',
        'commit': {
          '@type': 'commit',
          '@representation': 'standard',
          '@href': '/commit/1',
          'id': 1,
          'sha': 'abc123'
        },
        'jobs': [{
          '@type': 'job',
          '@href': '/job/1',
          '@representation': 'minimal',
          'id': 1,
          'number': '1.1'
        }]
      }
    }
  };

  let store = this.store();
  let serializer = store.serializerFor('repo');
  let result = serializer.normalizeResponse(store, store.modelFor('repo'), payload, 1, 'findRecord');
  let { type, id, attributes, relationships } = result.data;

  assert.equal(type, 'repo');
  assert.equal(id, '1');
  assert.equal(attributes.name, 'travis-web');
  assert.deepEqual(Object.keys(relationships).sort(), ['currentBuild', 'defaultBranch']);

  let includedRecords = result.included.map(({ id, type }) => { return { id, type }; });
  let expectedIncludedRecords = [
    { id: '/repo/1/branch/master', type: 'branch' },
    { id: '1', type: 'build' },
    { id: '1', type: 'commit' },
  ];

  assert.equal(includedRecords.length, 3);
  assert.deepEqual(includedRecords, expectedIncludedRecords);
});
