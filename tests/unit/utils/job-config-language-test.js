import jobConfigLanguage from 'travis/utils/job-config-language';

const { module, test } = QUnit;

module('jobConfigLanguage');

test('an empty config returns an empty string', (assert) => {
  assert.equal(jobConfigLanguage({}), '', 'expected an empty config to return an empty string');
});

test('a job with an RVM value returns Ruby with its version', (assert) => {
  assert.equal(jobConfigLanguage({ rvm: '2.2' }), 'Ruby: 2.2');
});

test('a Ruby job with no RVM value returns Ruby alone', (assert) => {
  assert.equal(jobConfigLanguage({ language: 'ruby' }), 'Ruby');
});

test('a job with two language-related keys returns both languages', (assert) => {
  assert.equal(jobConfigLanguage({ rvm: '2.1', node_js: '5.3' }), 'Node.js: 5.3 Ruby: 2.1');
});

test('a job with a Gemfile and an env shows the Gemfile', (assert) => {
  assert.equal(jobConfigLanguage({ gemfile: 'Hellofile', env: 'yes' }), 'Gemfile: Hellofile');
});

test('the Gemfile is shown after the languages', (assert) => {
  assert.equal(jobConfigLanguage({ gemfile: 'Hellofile', env: 'yes', node_js: '6.0' }), 'Node.js: 6.0 Gemfile: Hellofile');
});

test('a job with a Gemfile without an env does not show the Gemfile', (assert) => {
  assert.equal(jobConfigLanguage({ gemfile: 'Nofile' }), '', 'expected a Gemfile-only config to return an empty string');
});
