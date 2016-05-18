import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import settingsPage from 'travis/tests/pages/settings';

moduleForAcceptance('Acceptance | repo settings', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    const organization = server.create('account', {
      name: 'Goldsmiths',
      type: 'organization',
      login: 'goldsmiths',
      repos_count: 30
    });

    const repository = server.create('repository', {
      name: 'living-a-feminist-life',

      // FIXME this is maybe not the best way to create dependent models
      settings: {
        builds_only_with_travis_yml: true,
        build_pushes: true
      },

      env_vars: [],

      "@permissions": []
    });

    const branch = server.create('branch', {something: true});
    const repoId = parseInt(repository.id);

    server.create('permissions', {
      admin: [repoId],
      push: [repoId],
      pull: [repoId],
      permissions: [repoId],
    });

  }
});

test('view settings', function(assert) {
  settingsPage.visit({organization: 'goldsmiths', repo: 'living-a-feminist-life'});

  andThen(function() {
    assert.ok(settingsPage.buildOnlyWithTravisYml.isActive, 'expected build-only-with-travis-yml to be enabled');
  });
});
