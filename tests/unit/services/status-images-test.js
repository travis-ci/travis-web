import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const authServiceStub = Ember.Service.extend({
  assetToken() {
    return 'token-abc-123';
  }
});

moduleFor('service:status-images', 'Unit | Service | status images', {
  beforeEach() {
    this.register('service:auth', authServiceStub);
    this.inject.service('auth');
  }
});

const root = `${location.protocol}//${location.host}`;
const secureRoot = `https://${location.host}`;

const slug = 'travis-ci/travis-web';
const branch = 'primary';

test('it generates an image url with a slug', function (assert) {
  const service = this.subject();
  const url = service.imageUrl(slug);
  assert.equal(url, `${root}/travis-ci/travis-web.svg`);
});

test('it generates an image url with a slug and a branch', function (assert) {
  const service = this.subject();
  const url = service.imageUrl(slug, branch);
  assert.equal(url, `${root}/travis-ci/travis-web.svg?branch=primary`);
});

test('it generates an image url with a slug and a branch and pro feature enabled', function (assert) {
  let service = this.subject();
  service.set('features', Ember.Object.create());
  service.set('features.proVersion', true);
  const url = service.imageUrl(slug, branch);
  assert.equal(url, `${root}/travis-ci/travis-web.svg?token=token-abc-123&branch=primary`);
  service.set('features.proVersion', false);
});

test('it generates a Markdown image string with a slug', function (assert) {
  const service = this.subject();
  const markdown = service.markdownImageString(slug);
  assert.equal(markdown, `[![Build Status](${root}/travis-ci/travis-web.svg)](${secureRoot}/travis-ci/travis-web)`);
});

test('it generates a Markdown image string with a slug and a branch', function (assert) {
  const service = this.subject();
  const markdown = service.markdownImageString(slug, branch);
  assert.equal(markdown, `[![Build Status](${root}/travis-ci/travis-web.svg?branch=primary)](${secureRoot}/travis-ci/travis-web)`);
});

test('it generates a Textile image string with a slug', function (assert) {
  const service = this.subject();
  const textile = service.textileImageString(slug);
  assert.equal(textile, `!${root}/travis-ci/travis-web.svg!:${secureRoot}/travis-ci/travis-web`);
});

test('it generates a Textile image string with a slug and a branch', function (assert) {
  const service = this.subject();
  const textile = service.textileImageString(slug, branch);
  assert.equal(textile, `!${root}/travis-ci/travis-web.svg?branch=primary!:${secureRoot}/travis-ci/travis-web`);
});

test('it generates an Rdoc image string with a slug', function (assert) {
  const service = this.subject();
  const rdoc = service.rdocImageString(slug);
  assert.equal(rdoc, `{<img src="${root}/travis-ci/travis-web.svg" alt="Build Status" />}[${secureRoot}/travis-ci/travis-web]`);
});

test('it generates an Rdoc image string with a slug and a branch', function (assert) {
  const service = this.subject();
  const rdoc = service.rdocImageString(slug, branch);
  assert.equal(rdoc, `{<img src="${root}/travis-ci/travis-web.svg?branch=primary" alt="Build Status" />}[${secureRoot}/travis-ci/travis-web]`);
});

test('it generates an Asciidoc image string with a slug', function (assert) {
  const service = this.subject();
  const asciidoc = service.asciidocImageString(slug);
  assert.equal(asciidoc, `image:${root}/travis-ci/travis-web.svg["Build Status", link="${secureRoot}/travis-ci/travis-web"]`);
});

test('it generates an Asciidoc image string with a slug and a branch', function (assert) {
  const service = this.subject();
  const asciidoc = service.asciidocImageString(slug, branch);
  assert.equal(asciidoc, `image:${root}/travis-ci/travis-web.svg?branch=primary["Build Status", link="${secureRoot}/travis-ci/travis-web"]`);
});

test('it generates an RST image string with a slug', function (assert) {
  const service = this.subject();
  const rst = service.rstImageString(slug);
  assert.equal(rst, `.. image:: ${root}/travis-ci/travis-web.svg\n    :target: ${secureRoot}/travis-ci/travis-web`);
});

test('it generates an RST image string with a slug and a branch', function (assert) {
  const service = this.subject();
  const rst = service.rstImageString(slug, branch);
  assert.equal(rst, `.. image:: ${root}/travis-ci/travis-web.svg?branch=primary\n    :target: ${secureRoot}/travis-ci/travis-web`);
});

test('it generates a Pod image string with a slug', function (assert) {
  const service = this.subject();
  const pod = service.podImageString(slug);
  assert.equal(pod, `=for html <a href="${secureRoot}/travis-ci/travis-web"><img src="${root}/travis-ci/travis-web.svg"></a>`);
});

test('it generates a Pod image string with a slug and a branch', function (assert) {
  const service = this.subject();
  const pod = service.podImageString(slug, branch);
  assert.equal(pod, `=for html <a href="${secureRoot}/travis-ci/travis-web"><img src="${root}/travis-ci/travis-web.svg?branch=primary"></a>`);
});

test('it generates CCTray url with a slug', function (assert) {
  const service = this.subject();
  let url = service.ccXml(slug);
  assert.equal(url, '#/repos/travis-ci/travis-web/cc.xml');
});

test('it generates CCTray url with a slug and a branch', function (assert) {
  const service = this.subject();
  let url = service.ccXml(slug, branch);
  assert.equal(url, '#/repos/travis-ci/travis-web/cc.xml?branch=primary');
});

test('it generaes CCTray url with a slug and a branch and when pro feature flag enabled', function (assert) {
  const service = this.subject();
  service.set('features', Ember.Object.create());
  service.set('features.proVersion', true);
  let url = service.ccXml(slug, branch);
  assert.equal(url, '#/repos/travis-ci/travis-web/cc.xml?branch=primary&token=token-abc-123');
  service.set('features.proVersion', false);
});
