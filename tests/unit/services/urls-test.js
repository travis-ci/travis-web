import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const authServiceStub = Ember.Service.extend({
  token() {
    return 'token-abc-123';
  }
});

moduleFor('service:urls', 'Unit | Service | urls', {
  beforeEach() {
    this.register('service:auth', authServiceStub);
    this.inject.service('auth');

    this.id = '1';
    this.slug = 'travis-ci/travis-web';
    this.sha = '123abc';
    this.branch = 'new-pr';
    this.pullRequestNumber = '999';
  }
});

test('plainTextLog', function (assert) {
  let service = this.subject();
  assert.equal(service.plainTextLog(this.id), '/jobs/1/log.txt?deansi=true');
});

test('githubPullRequest', function (assert) {
  let service = this.subject();
  assert.equal(service.githubPullRequest(this.slug, this.pullRequestNumber), 'https://github.com/travis-ci/travis-web/pull/999');
});

test('githubCommit', function (assert) {
  let service = this.subject();
  assert.equal(service.githubCommit(this.slug, this.sha), 'https://github.com/travis-ci/travis-web/commit/123abc');
});

test('githubRepo', function (assert) {
  let service = this.subject();
  assert.equal(service.githubRepo(this.slug), 'https://github.com/travis-ci/travis-web');
});

test('githubWatchers', function (assert) {
  let service = this.subject();
  assert.equal(service.githubWatchers(this.slug), 'https://github.com/travis-ci/travis-web/watchers');
});

test('githubNetwork', function (assert) {
  let service = this.subject();
  assert.equal(service.githubNetwork(this.slug), 'https://github.com/travis-ci/travis-web/network');
});

test('githubAdmin', function (assert) {
  let service = this.subject();
  assert.equal(service.githubAdmin(this.slug), 'https://github.com/travis-ci/travis-web/settings/hooks#travis_minibucket');
});

test('statusImage', function (assert) {
  let service = this.subject();
  assert.equal(service.statusImage(this.slug, this.branch), 'http://localhost:7357/travis-ci/travis-web.svg?branch=new-pr');
});

test('statusImage when pro feature flag enabled', function (assert) {
  let service = this.subject();
  service.set('features', Ember.Object.create());
  service.set('features.proVersion', true);
  assert.equal(service.statusImage(this.slug, this.branch), 'http://localhost:7357/travis-ci/travis-web.svg?token=token-abc-123&branch=new-pr');
  service.set('features.proVersion', false);
});

test('ccXml', function (assert) {
  let service = this.subject();
  assert.equal(service.ccXml(this.slug, this.branch), '#/repos/travis-ci/travis-web/cc.xml?branch=new-pr');
});

test('ccXml when pro feature flag enabled', function (assert) {
  let service = this.subject();
  service.set('features', Ember.Object.create());
  service.set('features.proVersion', true);
  assert.equal(service.ccXml(this.slug, this.branch), '#/repos/travis-ci/travis-web/cc.xml?branch=new-pr&token=token-abc-123');
  service.set('features.proVersion', false);
});

test('email', function (assert) {
  let service = this.subject();
  const email = 'builder@travis-ci.com';
  assert.equal(service.email(email), 'mailto:builder@travis-ci.com');
});

test('gravatarImage', function (assert) {
  let service = this.subject();
  const email = 'builder@travis-ci.com';
  const size = 'large';
  assert.equal(service.gravatarImage(email, size), 'https://www.gravatar.com/avatar/7e04deb54e09fefd971875250cf6b415?s=large&d=blank');
});
