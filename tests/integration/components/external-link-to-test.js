import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | external link to', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders correctly and securely', async function (assert) {
    const content = 'LINK TO GITHUB';
    const href = 'https://github.com/travis-ci/travis-web';

    this.set('href', href);
    this.set('content', content);

    await render(hbs`{{external-link-to href=href content=content}}`);

    assert.equal(this.$().text().trim(), content);
    assert.equal(this.$('a').attr('href'), href, 'Sets href correctly');

    assert.equal(this.$('a').attr('target'), '_blank', 'Opens up the link in a new tab');
    // eslint-disable-next-line
    assert.equal(this.$('a').attr('rel'), 'noopener noreferrer', 'Mitigates the security vulnerability discussed in https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/');

    await render(hbs`
      {{#external-link-to href=href}}
        <span class="foobar">FOOBAR</span>
      {{/external-link-to}}
    `);

    assert.equal(this.$('a').attr('href'), href, 'Sets href correctly');
    assert.equal(this.$('span.foobar').text().trim(), 'FOOBAR');
    assert.equal(this.$('a').attr('target'), '_blank', 'Opens up the link in a new tab');
    // eslint-disable-next-line
    assert.equal(this.$('a').attr('rel'), 'noopener noreferrer', 'Mitigates the security vulnerability discussed in https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/');
  });
});
