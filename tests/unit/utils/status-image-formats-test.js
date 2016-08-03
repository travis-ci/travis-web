import format from 'travis/utils/status-image-formats';

module('Status image formats');

const root = `${location.protocol}//${location.host}`;
const secureRoot = `https://${location.host}`;

test('it generates an image url with a slug', function (assert) {
  const url = format('Image URL', 'travis-ci/travis-web');
  assert.equal(url, `${root}/travis-ci/travis-web.svg`);
});

test('it generates an image url with a slug and a branch', function (assert) {
  const url = format('Image URL', 'travis-ci/travis-web', 'primary');
  assert.equal(url, `${root}/travis-ci/travis-web.svg?branch=primary`);
});

test('it generates a Markdown image string with a slug', function (assert) {
  const markdown = format('Markdown', 'travis-ci/travis-web');
  assert.equal(markdown, `[![Build Status](${root}/travis-ci/travis-web.svg)](${secureRoot}/travis-ci/travis-web)`);
});

test('it generates a Markdown image string with a slug and a branch', function (assert) {
  const markdown = format('Markdown', 'travis-ci/travis-web', 'primary');
  assert.equal(markdown, `[![Build Status](${root}/travis-ci/travis-web.svg?branch=primary)](${secureRoot}/travis-ci/travis-web)`);
});

test('it generates a Textile image string with a slug', function (assert) {
  const textile = format('Textile', 'travis-ci/travis-web');
  assert.equal(textile, `!${root}/travis-ci/travis-web.svg!:${secureRoot}/travis-ci/travis-web`);
});

test('it generates a Textile image string with a slug and a branch', function (assert) {
  const textile = format('Textile', 'travis-ci/travis-web', 'primary');
  assert.equal(textile, `!${root}/travis-ci/travis-web.svg?branch=primary!:${secureRoot}/travis-ci/travis-web`);
});

test('it generates an Rdoc image string with a slug', function (assert) {
  const rdoc = format('Rdoc', 'travis-ci/travis-web');
  assert.equal(rdoc, `{<img src="${root}/travis-ci/travis-web.svg" alt="Build Status" />}[${secureRoot}/travis-ci/travis-web]`);
});

test('it generates an Rdoc image string with a slug and a branch', function (assert) {
  const rdoc = format('Rdoc', 'travis-ci/travis-web', 'primary');
  assert.equal(rdoc, `{<img src="${root}/travis-ci/travis-web.svg?branch=primary" alt="Build Status" />}[${secureRoot}/travis-ci/travis-web]`);
});

test('it generates an Asciidoc image string with a slug', function (assert) {
  const asciidoc = format('AsciiDoc', 'travis-ci/travis-web');
  assert.equal(asciidoc, `image:${root}/travis-ci/travis-web.svg["Build Status", link="${secureRoot}/travis-ci/travis-web"]`);
});

test('it generates an Asciidoc image string with a slug and a branch', function (assert) {
  const asciidoc = format('AsciiDoc', 'travis-ci/travis-web', 'primary');
  assert.equal(asciidoc, `image:${root}/travis-ci/travis-web.svg?branch=primary["Build Status", link="${secureRoot}/travis-ci/travis-web"]`);
});

test('it generates an RST image string with a slug', function (assert) {
  const rst = format('RST', 'travis-ci/travis-web');
  assert.equal(rst, `.. image:: ${root}/travis-ci/travis-web.svg\n    :target: ${secureRoot}/travis-ci/travis-web`);
});

test('it generates an RST image string with a slug and a branch', function (assert) {
  const rst = format('RST', 'travis-ci/travis-web', 'primary');
  assert.equal(rst, `.. image:: ${root}/travis-ci/travis-web.svg?branch=primary\n    :target: ${secureRoot}/travis-ci/travis-web`);
});

test('it generates a Pod image string with a slug', function (assert) {
  const pod = format('Pod', 'travis-ci/travis-web');
  assert.equal(pod, `=for html <a href="${secureRoot}/travis-ci/travis-web"><img src="${root}/travis-ci/travis-web.svg"></a>`);
});

test('it generates a Pod image string with a slug and a branch', function (assert) {
  const pod = format('Pod', 'travis-ci/travis-web', 'primary');
  assert.equal(pod, `=for html <a href="${secureRoot}/travis-ci/travis-web"><img src="${root}/travis-ci/travis-web.svg?branch=primary"></a>`);
});

test('it generates CCTray url with a slug', function () {
  var url;
  url = format('CCTray', 'travis-ci/travis-web');
  return equal(url, '#/repos/travis-ci/travis-web/cc.xml');
});

test('it generates CCTray url with a slug and a branch', function () {
  var url;
  url = format('CCTray', 'travis-ci/travis-web', 'development');
  return equal(url, '#/repos/travis-ci/travis-web/cc.xml?branch=development');
});
