import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import moment from 'moment';

moduleForAcceptance('Acceptance | profile/basic layout', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });
    this.user = currentUser;

    signInUser(currentUser);

    // create organization
    server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30
    });

    // create active repository
    server.create('repository', {
      name: 'living-a-feminist-life',
      owner: {
        login: 'feministkilljoy',
      },
      active: true,
      permissions: {
        admin: true
      },
    });

    // create inactive repository
    server.create('repository', {
      name: 'willful-subjects',
      owner: {
        login: 'feministkilljoy',
      },
      active: false,
      permissions: {
        admin: true
      },
    });

    // create repository without admin permissions
    server.create('repository', {
      name: 'affect-theory-reader',
      owner: {
        login: 'feministkilljoy',
      },
      active: true,
      permissions: {
        admin: false
      },
    });

    // create other random repository to ensure correct filtering
    server.create('repository', {
      name: 'feminism-is-for-everybody',
      owner: {
        login: 'bellhooks',
      },
      active: false
    });

    this.subscription = server.create('subscription', {
      'valid_to': '2018-03-08T02:38:08Z'
    });

    currentUser.subscription = this.subscription;
    currentUser.save();
  }
});

test('view profile when v2 billing is on', function (assert) {
  localStorage.setItem('travis.billing-v2', 'true');

  profilePage.visit({ username: 'feministkilljoy' });

  andThen(() =>  {
    percySnapshot(assert);
    assert.equal(document.title, 'Sara Ahmed - Profile - Travis CI');

    assert.equal(profilePage.name, 'Sara Ahmed');

    assert.equal(profilePage.accounts.length, 2, 'expected two accounts');

    assert.equal(profilePage.accounts[0].name, 'Sara Ahmed');
    assert.equal(profilePage.accounts[0].repositoryCount, '3 repositories');

    assert.equal(profilePage.accounts[1].name, 'Feminist Killjoys');
    assert.equal(profilePage.accounts[1].repositoryCount, '30 repositories');

    assert.equal(profilePage.subscription.validTo, moment(this.subscription.valid_to).format('MMMM D, YYYY'));

    assert.equal(profilePage.administerableRepositories.length, 3, 'expected three repositories');

    assert.equal(profilePage.administerableRepositories[0].name, 'feministkilljoy/affect-theory-reader');
    assert.ok(profilePage.administerableRepositories[0].isDisabled, 'expected disabled repository to be disabled in UI');
    assert.equal(profilePage.administerableRepositories[1].name, 'feministkilljoy/living-a-feminist-life');
    assert.ok(profilePage.administerableRepositories[1].isActive, 'expected active repository to appear active');
    assert.equal(profilePage.administerableRepositories[2].name, 'feministkilljoy/willful-subjects');
    assert.notOk(profilePage.administerableRepositories[2].isActive, 'expected inactive repository to appear inactive');
  });
});

test('subscription is hidden when v2 billing is not on', function (assert) {
  profilePage.visit({ username: 'feministkilljoy' });

  andThen(() => {
    assert.ok(profilePage.subscription.isHidden, 'expected subscription to be hidden when v2 billing is not on');
  });
});

test('subscription is hidden when v2 billing is on but there is no subscription', function (assert) {
  this.user.subscription = null;
  this.user.save();

  localStorage.setItem('travis.billing-v2', 'true');

  profilePage.visit({ username: 'feministkilljoy' });

  andThen(() => {
    assert.ok(profilePage.subscription.isHidden, 'expected subscription to be hidden when v2 billing is not on');
  });
});
