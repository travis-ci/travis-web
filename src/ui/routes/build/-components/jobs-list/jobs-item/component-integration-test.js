import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('jobs-item', 'Integration | Component | jobs item', {
  integration: true
});

test('it renders', function (assert) {
  const job = {
    id: 10,
    state: 'passed',
    number: '2',
    config: {
      rvm: '2.1.2',
      jdk: 'openjdk6',
      os: 'linux',
      env: 'TESTS=unit'
    },
    duration: 100
  };
  this.job = job;
  this.render(hbs`{{jobs-item job=job}}`);

  assert.ok(this.$().find('.jobs-item').hasClass('passed'), 'component should have a state class (passed)');
  assert.equal(this.$().find('.job-number').text().trim(), '2', 'job number should be displayed');
  assert.equal(this.$().find('.job-lang').text().trim(), 'JDK: openjdk6 Ruby: 2.1.2', 'langauges list should be displayed');
  assert.equal(this.$().find('.job-env').text().trim(), 'TESTS=unit', 'env should be displayed');
  assert.ok(this.$().find('.job-os').hasClass('linux'), 'OS class should be added for OS icon');
  assert.equal(this.$().find('.job-duration').text().trim(), '1 min 40 sec', 'duration should be displayed');
});

test('outputs info on not set properties', function (assert) {
  const job = {};
  this.job = job;
  this.render(hbs`{{jobs-item job=job}}`);

  assert.ok(this.$().find('.job-env').text().match(/no environment variables set/), 'a message for no env vars should be displayed');
  assert.ok(this.$().find('.job-lang').text().match(/no language set/), 'a message about no language being set should be displayed');
});

test('when env is not set, gemfile is displayed in the env section', function (assert) {
  const job = {
    id: 10,
    state: 'passed',
    number: '2',
    config: {
      rvm: '2.1.2',
      gemfile: 'foo/Gemfile'
    },
    duration: 100
  };

  this.job = job;
  this.render(hbs`{{jobs-item job=job}}`);

  assert.equal(this.$().find('.job-lang .label-align').text().trim(), 'Ruby: 2.1.2', 'langauges list should be displayed');
  assert.equal(this.$().find('.job-env .label-align').text().trim(), 'Gemfile: foo/Gemfile', 'env should be displayed');
});

test('when env is set, gemfile is displayed in the language section', function (assert) {
  const job = {
    id: 10,
    state: 'passed',
    number: '2',
    config: {
      rvm: '2.1.2',
      gemfile: 'foo/Gemfile',
      env: 'FOO=bar'
    },
    duration: 100
  };
  this.job = job;
  this.render(hbs`{{jobs-item job=job}}`);

  assert.equal(this.$().find('.job-lang .label-align').text().trim(), 'Ruby: 2.1.2 Gemfile: foo/Gemfile', 'Gemfile should be displayed in languages section');
  assert.equal(this.$().find('.job-env .label-align').text().trim(), 'FOO=bar', 'env should be displayed');
});
