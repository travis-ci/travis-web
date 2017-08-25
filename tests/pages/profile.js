import PageObject from 'travis/tests/page-object';

let {
  attribute,
  clickable,
  collection,
  hasClass,
  text,
  visitable
} = PageObject;

function hooksCollection(scope) {
  return collection({
    scope: scope,
    itemScope: '.profile-hooklist .row',

    item: {
      name: text('a.profile-repo'),
      isActive: hasClass('active', '.switch'),
      toggle: clickable('.switch'),
      ariaChecked: attribute('aria-checked', '.switch'),
      role: attribute('role', '.switch')
    }
  });
}

export default PageObject.create({
  visit: visitable('profile/:username'),
  name: text('.profile-header h1'),

  notFoundOrgName: text('.page-title .h2--red'),

  administerableHooks: hooksCollection('#administerable-hooks'),
  unadministerableHooks: hooksCollection('#unadministerable-hooks'),

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
