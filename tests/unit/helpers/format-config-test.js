import { safeFormatConfig } from 'travis/helpers/format-config';

const { module, test } = QUnit;

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

test('it only deletes certain keys if they are empty', (assert) => {
  const config = [{
    addons: {},
    language: 'clojure'
  }];

  let result = safeFormatConfig(config);
  assert.equal(result, '{\n  \"language\": \"clojure\"\n}');

  const config2 = [{
    addons: { foo: 'bar' },
    language: 'clojure'
  }];
  let result2 = safeFormatConfig(config2);

  assert.equal(result2, '{\n  \"addons\": {\n    \"foo\": \"bar\"\n  },\n  \"language\": \"clojure\"\n}');
});

test('it handles an empty config array', assert => {
  const config = [];
  const result = safeFormatConfig(config);

  assert.equal(result, '{}');
});
