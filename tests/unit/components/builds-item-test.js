import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('builds-item', {
    needs: ['helper:format-sha', 'helper:format-duration', 'helper:format-time', 'helper:format-message', 'helper:pretty-date', 'component:status-icon', 'component:request-icon', 'component:user-avatar']
});

test('it renders', function(assert) {
  var attributes, component;
  attributes = {
    id: 10000,
    state: 'passed',
    number: 11,
    branch: 'foobarbranch',
    message: void 0,
    pullRequest: false,
    eventType: 'push',
    commit: {
      sha: "a5e8093098f9c0fb46856b753fb8943c7fbf26f3",
      branch: 'foobarbranch',
      authorName: 'Test Author',
      authorEmail: 'author@example.com'
    },
    repo: {
      slug: 'foo/bar'
    }
  };
  component = this.subject();
  component.set('build', attributes);
  this.render();
  ok(component.$().hasClass('passed'), 'component has right status class');
  equal(component.$('.row-branch a').text().trim(), 'foobarbranch', 'component renders branch if event is push');
  return equal(component.$('a[title="See the commit on GitHub"]').attr('href'), 'https://github.com/foo/bar/commit/a5e8093098f9c0fb46856b753fb8943c7fbf26f3', 'component generates right commit link');
});
