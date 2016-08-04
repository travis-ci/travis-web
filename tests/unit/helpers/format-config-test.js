import { safeFormatConfig } from 'travis/helpers/format-config';
import { module, test } from 'qunit';

module('Unit | Helper | format config');

test('it returns the filtered config object', (assert) => {
  const config = [{
    language: 'ruby',
    sudo: false,
    '.result': 'configured',
    notifications: false
  }];
  let result = safeFormatConfig(config);
  assert.equal(result, '{\n  \"language\": \"ruby\",\n  \"sudo\": false\n}');
});
