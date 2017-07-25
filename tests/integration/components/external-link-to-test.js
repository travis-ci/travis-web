import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('external-link-to', 'Integration | Component | external link to', {
  integration: true
});

test('it renders correctly and securely', function (assert) {
  const content = 'LINK TO GITHUB';
  const href = 'https://github.com/travis-ci/travis-web';
  const title = 'See the repo on GitHub';

  this.set('href', href);
  this.set('title', title);
  this.set('content', content);

  this.render(hbs`{{external-link-to href=href title=title content=content}}`);

  assert.equal(this.$().text().trim(), content);
  assert.equal(this.$('a').attr('title'), title, 'Sets title correctly');
  assert.equal(this.$('a').attr('href'), href, 'Sets href correctly');

  assert.equal(this.$('a').attr('target'), '_blank', 'Opens up the link in a new tab');
  // eslint-disable-next-line
  assert.equal(this.$('a').attr('rel'), 'noopener noreferrer', 'Mitigates the security vulnerability discussed in https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/');

  this.render(hbs`
    {{#external-link-to href=href title=title}}
      <span class="foobar">FOOBAR</span>
    {{/external-link-to}}
  `);

  assert.equal(this.$('a').attr('title'), title, 'Sets title correctly');
  assert.equal(this.$('a').attr('href'), href, 'Sets href correctly');
  assert.equal(this.$('span.foobar').text().trim(), 'FOOBAR');
  assert.equal(this.$('a').attr('target'), '_blank', 'Opens up the link in a new tab');
  // eslint-disable-next-line
  assert.equal(this.$('a').attr('rel'), 'noopener noreferrer', 'Mitigates the security vulnerability discussed in https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/');
});
