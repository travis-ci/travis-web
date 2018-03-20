import EmberObject from '@ember/object';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import fillIn from '../../helpers/fill-in';

module('Integration | Component | status images', function(hooks) {
  setupRenderingTest(hooks);

  test('shows default branch as option and updates output', async function(assert) {
    const repo = EmberObject.create({
      slug: 'travis-ci/travis-web',
      defaultBranch: {
        name: 'not-actually-master'
      },
      branches: [
        { name: 'not-actually-master' },
        { name: 'master' },
        { name: 'foo' }
      ]
    });

    this.set('repo', repo);
    await render(hbs`{{status-images repo=repo}}`);

    percySnapshot(assert);

    let selectBranch = this.$('.form-pair:first-of-type select');
    let outputTextarea = this.$('.form-pair textarea');
    assert.equal(this.$().find('h3').text().trim(), 'Status Image');
    assert.equal(selectBranch.val(), 'not-actually-master');
    assert.ok(outputTextarea.val().match(/branch=not-actually-master/));

    fillIn(selectBranch, 'foo');
    selectBranch.change();
    assert.ok(outputTextarea.val().match(/branch=foo/));
  });
});