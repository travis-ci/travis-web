import { moduleForModel, test } from 'ember-qunit';

moduleForModel('repo', 'Unit | Serializer | pusher-repo', {
  // Specify the other units that are required for this test.
  needs: ['serializer:repo', 'serializer:branch', 'serializer:build',
    'serializer:commit', 'model:commit', 'model:job', 'model:branch',
    'model:repo', 'model:build']
});

test('it serializes pusher payload', function (assert) {
  let payload = {
    'id': 1,
    'slug': 'drogus/test-project-1',
    'description': 'Test project',
    'private': false,
    'last_build_id': 2,
    'last_build_number': '2',
    'last_build_state': 'created',
    'last_build_duration': null,
    'last_build_language': null,
    'last_build_started_at': null,
    'last_build_finished_at': null,
    'github_language': 'ruby',
    'default_branch': {
      'name': 'master',
      'last_build_id': 2,
      '@href': '/repo/1/branch/master',
      'default_branch': true
    },
    'active': true,
    'current_build_id': 2
  };

  let store = this.store();
  let result = store.normalize('repo', payload);
  let { type, id, attributes, relationships } = result.data;

  assert.equal(type, 'repo');
  assert.equal(id, '1');

  let expectedAttributes = {
    'slug': 'drogus/test-project-1',
    'description': 'Test project',
    'private': false,
    'githubLanguage': 'ruby',
    'active': true,
    'owner': {
      'login': 'drogus'
    },
    'name': 'test-project-1'
  };
  assert.deepEqual(attributes, expectedAttributes);

  assert.deepEqual(Object.keys(relationships).sort(), ['currentBuild', 'defaultBranch']);

  assert.deepEqual(relationships.currentBuild.data, { id: '2', type: 'build' });
  assert.deepEqual(relationships.defaultBranch.data, { id: '/repo/1/branch/master', type: 'branch' });
});
