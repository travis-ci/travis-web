import EmberObject from '@ember/object';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import config from 'travis/config/environment';

const authServiceStub = Service.extend({
  get assetToken() {
    return 'token-abc-123';
  }
});

module('Unit | Service | status images', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:auth', authServiceStub);
    this.auth = this.owner.lookup('service:auth');

    this.repo = EmberObject.create({ slug: 'travis-ci/travis-web' });
  });

  const root = `${location.protocol}//${location.host}`;
  const secureRoot = `https://${location.host}`;

  const branch = 'primary';

  const { apiEndpoint } = config;

  test('it generates an image url with a token for a private repo', function (assert) {
    const service = this.owner.lookup('service:status-images');
    this.repo.set('private', true);
    const url = service.imageUrl(this.repo);
    assert.equal(url, `${root}/travis-ci/travis-web.svg?token=token-abc-123`);
  });

  test('it generates an image url with a token for a repo when publicMode is false', function (assert) {
    const service = this.owner.lookup('service:status-images');
    config.publicMode = false;
    const url = service.imageUrl(this.repo);
    assert.equal(url, `${root}/travis-ci/travis-web.svg?token=token-abc-123`);
    config.publicMode = true;
  });

  test('it generates an image url with a repo', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const url = service.imageUrl(this.repo);
    assert.equal(url, `${root}/travis-ci/travis-web.svg`);
  });

  test('it generates an image url with a repo and a branch', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const url = service.imageUrl(this.repo, branch);
    assert.equal(url, `${root}/travis-ci/travis-web.svg?branch=primary`);
  });

  test('it generates an image url with a private repo and a branc', function (assert) {
    let service = this.owner.lookup('service:status-images');
    this.repo.set('private', true);
    const url = service.imageUrl(this.repo, branch);
    assert.equal(url, `${root}/travis-ci/travis-web.svg?token=token-abc-123&branch=primary`);
  });

  test('it generates a Markdown image string with a repo', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const markdown = service.markdownImageString(this.repo);
    assert.equal(markdown, `[![Build Status](${root}/travis-ci/travis-web.svg)](${secureRoot}/travis-ci/travis-web)`);
  });

  test('it generates a Markdown image string with a repo and a branch', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const markdown = service.markdownImageString(this.repo, branch);
    assert.equal(markdown, `[![Build Status](${root}/travis-ci/travis-web.svg?branch=primary)](${secureRoot}/travis-ci/travis-web)`);
  });

  test('it generates a Textile image string with a repo', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const textile = service.textileImageString(this.repo);
    assert.equal(textile, `!${root}/travis-ci/travis-web.svg!:${secureRoot}/travis-ci/travis-web`);
  });

  test('it generates a Textile image string with a repo and a branch', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const textile = service.textileImageString(this.repo, branch);
    assert.equal(textile, `!${root}/travis-ci/travis-web.svg?branch=primary!:${secureRoot}/travis-ci/travis-web`);
  });

  test('it generates an Rdoc image string with a repo', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const rdoc = service.rdocImageString(this.repo);
    assert.equal(rdoc, `{<img src="${root}/travis-ci/travis-web.svg" alt="Build Status" />}[${secureRoot}/travis-ci/travis-web]`);
  });

  test('it generates an Rdoc image string with a repo and a branch', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const rdoc = service.rdocImageString(this.repo, branch);
    assert.equal(rdoc, `{<img src="${root}/travis-ci/travis-web.svg?branch=primary" alt="Build Status" />}[${secureRoot}/travis-ci/travis-web]`);
  });

  test('it generates an Asciidoc image string with a repo', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const asciidoc = service.asciidocImageString(this.repo);
    assert.equal(asciidoc, `image:${root}/travis-ci/travis-web.svg["Build Status", link="${secureRoot}/travis-ci/travis-web"]`);
  });

  test('it generates an Asciidoc image string with a repo and a branch', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const asciidoc = service.asciidocImageString(this.repo, branch);
    assert.equal(asciidoc, `image:${root}/travis-ci/travis-web.svg?branch=primary["Build Status", link="${secureRoot}/travis-ci/travis-web"]`);
  });

  test('it generates an RST image string with a repo', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const rst = service.rstImageString(this.repo);
    assert.equal(rst, `.. image:: ${root}/travis-ci/travis-web.svg\n    :target: ${secureRoot}/travis-ci/travis-web`);
  });

  test('it generates an RST image string with a repo and a branch', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const rst = service.rstImageString(this.repo, branch);
    assert.equal(rst, `.. image:: ${root}/travis-ci/travis-web.svg?branch=primary\n    :target: ${secureRoot}/travis-ci/travis-web`);
  });

  test('it generates a Pod image string with a repo', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const pod = service.podImageString(this.repo);
    assert.equal(pod, `=for html <a href="${secureRoot}/travis-ci/travis-web"><img src="${root}/travis-ci/travis-web.svg"></a>`);
  });

  test('it generates a Pod image string with a repo and a branch', function (assert) {
    const service = this.owner.lookup('service:status-images');
    const pod = service.podImageString(this.repo, branch);
    assert.equal(pod, `=for html <a href="${secureRoot}/travis-ci/travis-web"><img src="${root}/travis-ci/travis-web.svg?branch=primary"></a>`);
  });

  test('it generates CCTray url with a repo', function (assert) {
    const service = this.owner.lookup('service:status-images');
    let url = service.ccXml(this.repo);
    assert.equal(url, `#${apiEndpoint}/repos/travis-ci/travis-web/cc.xml`);
  });

  test('it generates CCTray url with a repo and a branch', function (assert) {
    const service = this.owner.lookup('service:status-images');
    let url = service.ccXml(this.repo, branch);
    assert.equal(url, `#${apiEndpoint}/repos/travis-ci/travis-web/cc.xml?branch=primary`);
  });

  test('it generaes CCTray url with a private repo and a branch', function (assert) {
    const service = this.owner.lookup('service:status-images');
    this.repo.set('private', true);
    let url = service.ccXml(this.repo, branch);
    assert.equal(url, `#${apiEndpoint}/repos/travis-ci/travis-web/cc.xml?branch=primary&token=token-abc-123`);
  });
});
