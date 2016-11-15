import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('builds-item', 'Integration | Component | builds item', {
  integration: true
});

test('it renders', function (assert) {
  const build = {
    id: 10000,
    state: 'passed',
    number: 11,
    branch: 'foobarbranch',
    message: void 0,
    pullRequest: false,
    eventType: 'push',
    commit: {
      sha: 'a5e8093098f9c0fb46856b753fb8943c7fbf26f3',
      branch: 'foobarbranch',
      authorName: 'Test Author',
      authorEmail: 'author@example.com'
    },
    repo: {
      slug: 'foo/bar'
    }
  };
  this.build = build;
  this.render(hbs`{{builds-item build=build}}`);

  assert.ok(this.$().find('.row-li').hasClass('passed'), 'component has right status class');
  assert.equal(this.$().find('.row-branch a').text().trim(), 'foobarbranch', 'component renders branch if event is push');
  assert.equal(this.$().find('a[title="See the commit on GitHub"]').attr('href'), 'https://github.com/foo/bar/commit/a5e8093098f9c0fb46856b753fb8943c7fbf26f3', 'component generates right commit link');
});
