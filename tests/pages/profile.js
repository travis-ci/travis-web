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
    itemScope: '.profile-repositorylist li.profile-repolist-item',

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
    scope: '.profile-user',

    isHidden: 'strong',

    show: clickable('a.profile-token-toggle'),
    value: text('strong')
  },

  accounts: collection({
    scope: '.profile-aside',
    itemScope: '.account',

    item: {
      name: text('.account-name'),
      repositoryCount: text('.account-repo-count')
    }
  })
});
