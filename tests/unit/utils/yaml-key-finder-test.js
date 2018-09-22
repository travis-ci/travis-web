import yamlKeyFinder from 'travis/utils/yaml-key-finder';
import { module, test } from 'qunit';

let yaml = `language: test
what: no
something: yest
nested:
  tested:
    - fested
  somewhat:
    no:
      - what
`;

module('Unit | Utility | yaml-key-finder', function (hooks) {
  test('it finds a key at the root', function (assert) {
    assert.equal(yamlKeyFinder(yaml, 'something'), 2);
  });

  test('it finds a nested key', function (assert) {
    assert.equal(yamlKeyFinder(yaml, 'nested.tested'), 4);
  });

  test('it returns null when a key is not found', function (assert) {
    assert.notOk(yamlKeyFinder(yaml, 'nested.never'));
    assert.notOk(yamlKeyFinder(yaml, 'nested.somewhat.yes'));
  });
});
