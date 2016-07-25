import jobConfigLanguage from 'travis/utils/job-config-language';

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
