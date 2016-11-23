import { moduleForModel, test } from 'ember-qunit';
import V3BuildsPayload from '../../fixtures/v3-builds-payload';

moduleForModel('build', 'Unit | Serializer | build', {
  // Specify the other units that are required for this test.
  needs: ['serializer:build', 'model:commit', 'model:job', 'model:branch']
});

test('it sets "pullRequest" if it is not set', function (assert) {
  let payload = {
    '@type': 'build',
    '@href': '...',
    event_type: 'pull_request',
    id: 1
  };

  let store = this.store();
  let serializer = store.serializerFor('build');
  let result = serializer.normalizeResponse(store, store.modelFor('build'), payload, 1, 'findRecord');
  assert.ok(result.data.attributes.pullRequest);
});

test('it normalizes the singular response', function (assert) {
  QUnit.dump.maxDepth = 10;
  const store = this.store();
  const serializer = store.serializerFor('build');
  const modelClass = store.modelFor('build');

  // just grab first build
  const payload = V3BuildsPayload()['builds'][0];

  const result = serializer.extractRelationships(modelClass, payload);

  const expected = {
    'branch': {
      'data': {
        'id': '/repo/1398458/branch/build',
        'type': 'branch'
      }
    },
    'commit': {
      'data': {
        'id': '50284741',
        'type': 'commit'
      }
    },
    'jobs': {
      'data': [
        {
          'id': '176288868',
          'type': 'job'
        },
        {
          'id': '176288869',
          'type': 'job'
        },
        {
          'id': '176288872',
          'type': 'job'
        },
        {
          'id': '176288873',
          'type': 'job'
        },
        {
          'id': '176288874',
          'type': 'job'
        }
      ]
    }
  };

  assert.deepEqual(result, expected);
});
