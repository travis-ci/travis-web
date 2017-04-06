import { moduleForModel, test } from 'ember-qunit';

moduleForModel('repo', 'Unit | Serializer | repo', {
  // Specify the other units that are required for this test.
  needs: ['serializer:repo', 'serializer:branch', 'serializer:build',
          'serializer:commit', 'model:commit', 'model:job', 'model:branch',
          'model:repo', 'model:build']
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
  assert.equal(relationships.keys, ['currentBuild', 'defaultBranch']);

  let includedRecords = result.included.map(({id, type}) => { return {id, type} });
  let expectedIncludedRecords = [
    { id: '/repo/1/branch/master', type: 'branch' },
    { id: '1', type: 'build' },
    { id: '1', type: 'commit' },
  ];

  assert.equal(includedRecords.length, 3);
  assert.deepEqual(includedRecords, expectedIncludedRecords);
});
