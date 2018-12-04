import EmberObject from '@ember/object';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import XSelect from 'emberx-select/test-support/interactor';

module('Integration | Component | status images', function (hooks) {
  setupRenderingTest(hooks);
  let xselect = new XSelect('.form-pair:first-of-type select');

  test('shows default branch as option and updates output', async function (assert) {
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

    let selectBranch = this.element.querySelector('.form-pair:first-of-type select');
    let outputTextarea = this.element.querySelector('.form-pair textarea');
    assert.dom('h3').hasText('Status Image');
    assert.equal(selectBranch.value, 'not-actually-master');
    assert.ok(outputTextarea.value.match(/branch=not-actually-master/));

    await xselect
      .select('foo')
      .when(() => {
        assert.equal(xselect.value.match(/branch=foo/, true));
        assert.equal(outputTextarea.value.match(/branch=foo/, true));
      });
  });
});
