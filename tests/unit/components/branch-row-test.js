import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('branch-row', 'BranchRowComponent', {
  needs: ['helper:format-time', 'helper:format-duration', 'helper:pretty-date', 'helper:format-sha', 'component:build-tile', 'component:status-icon', 'component:request-icon', 'component:loading-indicator']
});

test('it renders', function() {
  var attributes, component;
  attributes = {
    name: "master",
    repository: {
      id: 15038,
      name: "php-test-staging",
      slug: "travis-repos/php-test-staging"
    },
    default_branch: true,
    exists_on_github: true,
    last_build: {
      id: 393177,
      number: "1",
      state: "passed",
      duration: 22,
      event_type: "push",
      previous_state: null,
      started_at: "2015-03-10T23:19:31Z",
      finished_at: "2015-03-10T23:19:45Z",
      commit: {
        id: 160181,
        sha: "a82f6ba76c7b729375ed6a1d7a26b765f694df12",
        ref: "refs/heads/master",
        message: "Add money example as hello world",
        compare_url: "https://github.com/travis-repos/php-test-staging/compare/3d86ee98be2b...a82f6ba76c7b",
        committed_at: "2014-11-20T18:34:04Z",
        committer: {
          name: "Dan Buch",
          avatar_url: "https://0.gravatar.com/avatar/563fd372b4d51781853bc85147f06a36"
        },
        author: {
          name: "Dan Buch",
          avatar_url: "https://0.gravatar.com/avatar/563fd372b4d51781853bc85147f06a36"
        }
      }
    }
  };
  component = this.subject({
    branch: attributes
  });
  this.render();
  ok(component.$().hasClass('passed'), 'component should have state class (passed)');
  equal(component.$('.row-name .label-align').text().trim(), 'master', 'should display correct branch name');
  equal(component.$('.row-request .label-align').text().trim(), '#1 passed', 'should display build number and state');
  equal(component.$('.row-commiter .label-align').text().trim(), 'Dan Buch', 'should display correct commiter name');
  return equal(component.$('.row-commit .label-align').text().trim(), 'a82f6ba', 'should display correct commit sha');
});
