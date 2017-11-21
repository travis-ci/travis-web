import PageObject from 'travis/tests/page-object';

let {
  attribute,
  clickable,
  collection,
  hasClass,
  text,
  visitable,
  fillable
} = PageObject;

function existingRepositoriesCollection(scope) {
  return collection({
    scope: scope,
    itemScope: '.profile-repositorylist .row',

    item: {
      name: text('a.profile-repo'),
      isActive: hasClass('active', '.switch'),
      isDisabled: hasClass('non-admin', 'a.profile-repo'),
      toggle: clickable('.switch'),
      ariaChecked: attribute('aria-checked', '.switch'),
      role: attribute('role', '.switch')
    }
  });
}

export default PageObject.create({
  visit: visitable('profile/:username'),
  name: text('.profile-header h1'),
  filter: fillable('.profile-repositories-filter input.search'),
  noRepositoriesFoundByFilter: text('#administerable-repositories .no-results'),

  notFoundOrgName: text('.page-title .h2--red'),

  administerableRepositories: existingRepositoriesCollection('#administerable-repositories'),

  token: {
    scope: '.profile-user-last',

    isHidden: 'strong',

    show: clickable('a.profile-token-toggle'),
    value: text('strong')
  },

  accounts: collection({
    scope: '.profile-orgs',
    itemScope: '.account',

    item: {
      name: text('h2'),
      repositoryCount: text('.repository-count')
    }
  })
});
