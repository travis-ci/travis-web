import FaviconManager from 'travis/utils/favicon-manager';

import { module, test } from 'qunit';

module('Favicon manager', function (hooks) {
  hooks.beforeEach(function () {
    this.fixture = document.querySelector('#qunit-fixture');

    const fh = document.createElement('div');
    fh.setAttribute('id', 'fake-head');
    this.fixture.appendChild(fh);

    this.fakeHead = fh;
    this.manager = new FaviconManager(fh);
  });

  hooks.afterEach(function () {
    this.fixture.removeChild(this.fakeHead);
    this.manager = null;
  });

  test('use <head> tag by default', function (assert) {
    this.manager = new FaviconManager();
    assert.equal(this.manager.getHeadTag(), document.querySelector('head'));
  });

  test('set favicon if there is no link tag in head', function (assert) {
    let done = assert.async();
    assert.equal(this.fakeHead.querySelectorAll('link').length, 0, 'there should be no link tags initially');
    this.manager.setFavicon('foobar');
    const link = this.fakeHead.querySelectorAll('link')[0];
    assert.ok(link, 'link tag should be added by favicon manager');
    return setTimeout(function () {
      assert.equal(link.getAttribute('href'), 'foobar', 'href attribute for the link should be properly set');
      assert.equal(link.getAttribute('rel'), 'icon', 'rel attribute for the link should be properly set');
      assert.equal(link.getAttribute('type'), 'image/png', 'type attribute for the link should be properly set');
      done();
    }, 20);
  });

  test('replace existing link tag', function (assert) {
    let done = assert.async();
    const fooLink = document.createElement('link');
    fooLink.setAttribute('id', 'foo');
    fooLink.setAttribute('rel', 'icon');
    this.fakeHead.appendChild(fooLink);

    assert.ok('foo', this.fakeHead.querySelector('link').getAttribute('id'), 'initially link should exist');
    this.manager.setFavicon('foobar');
    const links = this.fakeHead.querySelectorAll('link');
    assert.equal(links.length, 1, 'there should be only one link in head');
    const link = links[0];
    assert.ok(!link.getAttribute('id'), 'existing link should be replaced with a new one');
    return setTimeout(function () {
      assert.equal(link.getAttribute('href'), 'foobar', 'href attribute for the link should be properly set');
      assert.equal(link.getAttribute('rel'), 'icon', 'rel attribute for the link should be properly set');
      assert.equal(link.getAttribute('type'), 'image/png', 'type attribute for the link should be properly set');
      done();
    }, 20);
  });

  test('find link with rel=icon only', function (assert) {
    const fooLink = document.createElement('link');
    fooLink.setAttribute('id', 'foo');
    fooLink.setAttribute('rel', 'foo');
    this.fakeHead.appendChild(fooLink);

    assert.notOk(this.manager.getLinkTag());
  });
});
