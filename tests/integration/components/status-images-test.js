import Ember from 'ember';
import { percySnapshot } from 'ember-percy';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import fillIn from '../../helpers/fill-in';

moduleForComponent('status-images', 'Integration | Component | status images', {
  integration: true
});

test('shows default branch as option and updates output', function (assert) {
  const repo = Ember.Object.create({
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
  this.render(hbs`{{status-images repo=repo}}`);

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
