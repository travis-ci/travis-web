import yamlAnnotator from 'travis/utils/annotate-yaml';
import { module, test } from 'qunit';

module('Unit | Utility | yaml-annotator', function (hooks) {
  test('it finds the line for a message', function (assert) {
    let yaml = 'sudo: required';
    let message = {
      code: 'cast',
      key: 'sudo',
    };

    let result = yamlAnnotator([message], yaml);
    assert.deepEqual(result, [{
      message,
      line: 0
    }]);
  });
});
