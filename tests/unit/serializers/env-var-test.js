import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | envVar', function (hooks) {
  setupTest(hooks);

  test('it normalizes a V2 array response', function (assert) {
    let payload = {
      'env_vars': [{
        'id': '7af987bc-412e-4bfd-9654-b4fec2dbadd3',
        'name': 'FOO',
        'value': 'bar',
        'public': true,
        'repository_id': 1
      }]
    };

    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('envVar');
    let result = serializer.normalize(store.modelFor('envVar'), payload.env_vars[0]);
    let expectedResult = {
      'data': {
        'id': '7af987bc-412e-4bfd-9654-b4fec2dbadd3',
        'type': 'env-var',
        'attributes': {
          'name': 'FOO',
          'value': 'bar',
          'public': true
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
      'included': []
    };

    assert.deepEqual(result, expectedResult);
  });
});
